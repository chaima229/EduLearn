// src/api/quizzes/controller/index.js
const { Quiz, QuizQuestion, ResponseOption, Course, Lesson } = require('../../../models');

// === Quiz CRUD ===
// @desc    Create a quiz (lié à un cours ou une leçon)
// @route   POST /api/courses/:courseId/quizzes OU POST /api/lessons/:lessonId/quizzes
// @access  Private (Instructeur du cours/leçon ou Admin)
exports.createQuiz = async (req, res, next) => {
    const { titre, description, seuil_reussite_pourcentage } = req.body;
    const { courseId, lessonId } = req.params; // Un des deux sera présent
    const created_by_user_id = req.user.id; // Ou une autre logique si admin crée pour un instructeur

    try {
        let parent_item;
        let quizData = { titre, description, seuil_reussite_pourcentage };

        if (courseId) {
            parent_item = await Course.findByPk(courseId);
            if (!parent_item) return res.status(404).json({ message: "Cours non trouvé." });
            if (parent_item.instructeur_id !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ message: "Non autorisé à créer un quiz pour ce cours." });
            }
            quizData.cours_id = courseId;
        } else if (lessonId) {
            parent_item = await Lesson.findByPk(lessonId, { include: Course });
            if (!parent_item) return res.status(404).json({ message: "Leçon non trouvée." });
            if (parent_item.Cour.instructeur_id !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ message: "Non autorisé à créer un quiz pour cette leçon." });
            }
            quizData.lecon_id = lessonId;
        } else {
            return res.status(400).json({ message: "Un quiz doit être lié à un cours ou à une leçon." });
        }

        const quiz = await Quiz.create(quizData);
        res.status(201).json(quiz);
    } catch (error) {
        next(error);
    }
};

// @desc    Get a quiz by ID (avec ses questions et options)
// @route   GET /api/quizzes/:id
// @access  Private (Utilisateur inscrit au cours/ayant accès à la leçon, ou instructeur/admin)
exports.getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findByPk(req.params.id, {
            include: [
                {
                    model: QuizQuestion,
                    order: [['ordre', 'ASC']],
                    include: [{ model: ResponseOption }] // Ne pas inclure est_correcte pour les étudiants !
                },
                { model: Course, attributes: ['id', 'titre', 'instructeur_id', 'est_publie']},
                { model: Lesson, include: [{model: Course, attributes: ['id', 'instructeur_id', 'est_publie']}]}
            ]
        });
        if (!quiz) return res.status(404).json({ message: "Quiz non trouvé." });

        // TODO: Logique de vérification d'accès (si le quiz est pour un cours/leçon publié, si l'user est inscrit, etc.)
        // Pour l'instant, on le laisse accessible si l'utilisateur est authentifié
        // Masquer les bonnes réponses pour les non-instructeurs/admins
        if (req.user.role === 'etudiant' || (quiz.Course && req.user.id !== quiz.Course.instructeur_id) || (quiz.Lesson && req.user.id !== quiz.Lesson.Cour.instructeur_id)) {
            quiz.QuizQuestions.forEach(question => {
                if(question.ResponseOptions){
                    question.ResponseOptions.forEach(option => {
                        delete option.dataValues.est_correcte; // Ou la cloner et la modifier
                    });
                }
            });
        }
        res.json(quiz);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Instructeur du cours/leçon associé ou Admin)
exports.updateQuiz = async (req, res, next) => {
    const { titre, description, seuil_reussite_pourcentage } = req.body;
    try {
        const quiz = await Quiz.findByPk(req.params.id, { include: [Course, Lesson]});
        if (!quiz) return res.status(404).json({ message: "Quiz non trouvé." });

        // Vérification de propriété/rôle
        let canUpdate = false;
        if (req.user.role === 'admin') canUpdate = true;
        if (quiz.Course && quiz.Course.instructeur_id === req.user.id) canUpdate = true;
        if (quiz.Lesson && quiz.Lesson.Cour && quiz.Lesson.Cour.instructeur_id === req.user.id) canUpdate = true;

        if (!canUpdate) return res.status(403).json({ message: "Non autorisé à modifier ce quiz." });

        quiz.titre = titre !== undefined ? titre : quiz.titre;
        quiz.description = description !== undefined ? description : quiz.description;
        quiz.seuil_reussite_pourcentage = seuil_reussite_pourcentage !== undefined ? seuil_reussite_pourcentage : quiz.seuil_reussite_pourcentage;
        await quiz.save();
        res.json(quiz);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Instructeur du cours/leçon associé ou Admin)
exports.deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findByPk(req.params.id, { include: [Course, Lesson]});
        if (!quiz) return res.status(404).json({ message: "Quiz non trouvé." });

        // Vérification similaire à updateQuiz
        let canDelete = false;
        if (req.user.role === 'admin') canDelete = true;
        if (quiz.Course && quiz.Course.instructeur_id === req.user.id) canDelete = true;
        if (quiz.Lesson && quiz.Lesson.Cour && quiz.Lesson.Cour.instructeur_id === req.user.id) canDelete = true;

        if (!canDelete) return res.status(403).json({ message: "Non autorisé à supprimer ce quiz." });

        await quiz.destroy(); // ON DELETE CASCADE s'occupera des questions/options
        res.json({ message: "Quiz supprimé." });
    } catch (error) {
        next(error);
    }
};

// === Questions de Quiz CRUD ===
// @desc    Add a question to a quiz
// @route   POST /api/quizzes/:quizId/questions
// @access  Private (Celui qui peut modifier le quiz)
exports.addQuestionToQuiz = async (req, res, next) => {
    const { texte_question, type_question, ordre, options } = req.body; // 'options' est un tableau pour QCM
    const { quizId } = req.params;
    try {
        const quiz = await Quiz.findByPk(quizId, { include: [Course, Lesson] });
        if (!quiz) return res.status(404).json({ message: "Quiz non trouvé." });

        // Vérif droits similaire à updateQuiz
        let canAdd = false;
        if (req.user.role === 'admin') canAdd = true;
        if (quiz.Course && quiz.Course.instructeur_id === req.user.id) canAdd = true;
        if (quiz.Lesson && quiz.Lesson.Cour && quiz.Lesson.Cour.instructeur_id === req.user.id) canAdd = true;
        if (!canAdd) return res.status(403).json({ message: "Non autorisé à ajouter une question à ce quiz." });

        const transaction = await sequelize.transaction(); // Utilisez sequelize de models/index.js
        try {
            const question = await QuizQuestion.create({
                quiz_id: quizId, texte_question, type_question, ordre
            }, { transaction });

            if (type_question === 'QCM' && options && Array.isArray(options)) {
                const optionObjects = options.map(opt => ({
                    question_id: question.id,
                    texte_option: opt.texte_option,
                    est_correcte: opt.est_correcte || false
                }));
                await ResponseOption.bulkCreate(optionObjects, { transaction });
            }
            await transaction.commit();
            // Recharger la question avec ses options pour la réponse
            const fullQuestion = await QuizQuestion.findByPk(question.id, { include: [ResponseOption] });
            res.status(201).json(fullQuestion);
        } catch(err) {
            await transaction.rollback();
            throw err; // Laisse le error handler principal s'en occuper
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update a quiz question
// @route   PUT /api/quiz-questions/:questionId  (Route séparée car une question n'est pas tjs modifiée VIA son quiz)
// @access  Private (Celui qui peut modifier le quiz associé)
exports.updateQuizQuestion = async (req, res, next) => {
    const { texte_question, type_question, ordre, options } = req.body;
    const { questionId } = req.params;
    try {
        const question = await QuizQuestion.findByPk(questionId, {
            include: [{ model: Quiz, include: [Course, Lesson] }]
        });
        if (!question) return res.status(404).json({ message: "Question non trouvée." });

        const quiz = question.Quiz;
        // Vérif droits similaire à updateQuiz
        let canUpdate = false;
        if (req.user.role === 'admin') canUpdate = true;
        if (quiz.Course && quiz.Course.instructeur_id === req.user.id) canUpdate = true;
        if (quiz.Lesson && quiz.Lesson.Cour && quiz.Lesson.Cour.instructeur_id === req.user.id) canUpdate = true;
        if (!canUpdate) return res.status(403).json({ message: "Non autorisé à modifier cette question." });

        const transaction = await sequelize.transaction();
        try {
            question.texte_question = texte_question !== undefined ? texte_question : question.texte_question;
            question.type_question = type_question !== undefined ? type_question : question.type_question;
            question.ordre = ordre !== undefined ? ordre : question.ordre;
            await question.save({ transaction });

            if (type_question === 'QCM' && options && Array.isArray(options)) {
                // Simpliste: supprimer les anciennes options et recréer.
                // Plus robuste: comparer et mettre à jour/ajouter/supprimer individuellement.
                await ResponseOption.destroy({ where: { question_id: question.id }, transaction });
                const optionObjects = options.map(opt => ({
                    question_id: question.id,
                    texte_option: opt.texte_option,
                    est_correcte: opt.est_correcte || false
                }));
                await ResponseOption.bulkCreate(optionObjects, { transaction });
            } else if (type_question !== 'QCM') { // Si ce n'est plus un QCM, supprimer les options
                await ResponseOption.destroy({ where: { question_id: question.id }, transaction });
            }
            await transaction.commit();
            const fullQuestion = await QuizQuestion.findByPk(question.id, { include: [ResponseOption] });
            res.json(fullQuestion);
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a quiz question
// @route   DELETE /api/quiz-questions/:questionId
// @access  Private (Celui qui peut modifier le quiz associé)
exports.deleteQuizQuestion = async (req, res, next) => {
    const { questionId } = req.params;
    try {
        const question = await QuizQuestion.findByPk(questionId, {
            include: [{ model: Quiz, include: [Course, Lesson] }]
        });
        if (!question) return res.status(404).json({ message: "Question non trouvée." });
        // Vérification des droits (similaire à update)
        const quiz = question.Quiz;
        let canDelete = false;
        if (req.user.role === 'admin') canDelete = true;
        if (quiz.Course && quiz.Course.instructeur_id === req.user.id) canDelete = true;
        if (quiz.Lesson && quiz.Lesson.Cour && quiz.Lesson.Cour.instructeur_id === req.user.id) canDelete = true;
        if (!canDelete) return res.status(403).json({ message: "Non autorisé à supprimer cette question." });

        await question.destroy(); // ON DELETE CASCADE s'occupera des options
        res.json({ message: "Question supprimée." });
    } catch (error) {
        next(error);
    }
};