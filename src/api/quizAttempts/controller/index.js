// src/api/quizAttempts/controller/index.js
const { QuizAttempt, Quiz, QuizQuestion, ResponseOption, User, sequelize } = require('../../../models');

// @desc    Submit a quiz attempt
// @route   POST /api/quizzes/:quizId/attempts
// @access  Private (Utilisateur qui peut accéder au quiz)
exports.submitQuizAttempt = async (req, res, next) => {
    const { quizId } = req.params;
    const utilisateur_id = req.user.id;
    const userAnswers = req.body.answers; // Format attendu: [{ question_id: X, option_id: Y }, { question_id: Z, answer_text: "..." }]

    if (!userAnswers || !Array.isArray(userAnswers)) {
        return res.status(400).json({ message: "Les réponses ('answers') doivent être un tableau." });
    }

    try {
        const quiz = await Quiz.findByPk(quizId, {
            include: [{
                model: QuizQuestion,
                include: [ResponseOption] // Besoin des options pour corriger
            }]
        });
        if (!quiz) return res.status(404).json({ message: "Quiz non trouvé." });
        // TODO: Vérifier si l'utilisateur a le droit de tenter ce quiz (inscrit au cours, etc.)

        let score = 0;
        let totalPossibleScore = 0; // Pourrait être basé sur le nombre de questions, ou des points par question

        // Logique de correction simple: 1 point par bonne réponse
        for (const question of quiz.QuizQuestions) {
            totalPossibleScore += 1; // Chaque question vaut 1 point
            const userAnswer = userAnswers.find(ans => ans.question_id === question.id);

            if (userAnswer) {
                if (question.type_question === 'QCM' || question.type_question === 'VRAI_FAUX') {
                    const correctOption = question.ResponseOptions.find(opt => opt.est_correcte === true);
                    if (correctOption && userAnswer.option_id === correctOption.id) {
                        score += 1;
                    }
                } else if (question.type_question === 'REPONSE_COURTE') {
                    // Pour REPONSE_COURTE, la correction est plus complexe.
                    // Il faudrait stocker la réponse correcte attendue avec la question,
                    // puis faire une comparaison (sensible à la casse, expression régulière, etc.).
                    // Ici, on ne note pas les réponses courtes pour simplifier.
                }
            }
        }

        const score_pourcentage = totalPossibleScore > 0 ? (score / totalPossibleScore) * 100 : 0;

        const attempt = await QuizAttempt.create({
            utilisateur_id,
            quiz_id: quizId,
            score_obtenu: score_pourcentage, // ou score brut si vous préférez
            reponses_utilisateur: userAnswers // Stocker les réponses soumises
        });

        res.status(201).json({
            message: "Tentative soumise.",
            attempt,
            score: score,
            totalPossibleScore: totalPossibleScore,
            scorePourcentage: score_pourcentage,
            passed: quiz.seuil_reussite_pourcentage ? (score_pourcentage >= quiz.seuil_reussite_pourcentage) : null
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get all attempts for a quiz by a user (ou toutes les tentatives si admin)
// @route   GET /api/quizzes/:quizId/attempts
// @access  Private
exports.getQuizAttempts = async (req, res, next) => {
    const { quizId } = req.params;
    try {
        const whereClause = { quiz_id: quizId };
        if (req.user.role !== 'admin') { // Un instructeur pourrait voir toutes les tentatives de SES quiz
            const quiz = await Quiz.findByPk(quizId, { include: [Course, Lesson]});
            if (quiz && ((quiz.Course && quiz.Course.instructeur_id === req.user.id) || (quiz.Lesson && quiz.Lesson.Cour.instructeur_id === req.user.id))) {
                // L'instructeur du quiz peut voir toutes les tentatives pour ce quiz
            } else {
                whereClause.utilisateur_id = req.user.id; // L'étudiant ne voit que ses propres tentatives
            }
        }

        const attempts = await QuizAttempt.findAll({
            where: whereClause,
            include: [{model: User, attributes:['id', 'nom_utilisateur']}], // Pour l'admin/instructeur
            order: [['date_tentative', 'DESC']]
        });
        res.json(attempts);
    } catch (error) {
        next(error);
    }
};

// @desc    Get a specific quiz attempt by ID
// @route   GET /api/quiz-attempts/:attemptId  (route non imbriquée)
// @access  Private (l'utilisateur de la tentative ou admin/instructeur du quiz)
exports.getQuizAttemptById = async (req, res, next) => {
    try {
        const attempt = await QuizAttempt.findByPk(req.params.attemptId, {
            include: [
                {model: User, attributes:['id', 'nom_utilisateur']},
                {model: Quiz, include: [QuizQuestion]} // Pour revoir le contexte
            ]
        });
        if (!attempt) return res.status(404).json({ message: "Tentative non trouvée." });

        // Vérif droits
        let canView = false;
        if (req.user.role === 'admin') canView = true;
        if (attempt.utilisateur_id === req.user.id) canView = true;
        // Si l'utilisateur est l'instructeur du quiz de cette tentative
        const quiz = await Quiz.findByPk(attempt.quiz_id, { include: [Course, Lesson] });
        if (quiz && ((quiz.Course && quiz.Course.instructeur_id === req.user.id) || (quiz.Lesson && quiz.Lesson.Cour.instructeur_id === req.user.id))) {
            canView = true;
        }

        if (!canView) return res.status(403).json({ message: "Accès non autorisé à cette tentative." });

        res.json(attempt);
    } catch (error) {
        next(error);
    }
};