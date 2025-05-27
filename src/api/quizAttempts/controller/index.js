// src/api/quizAttempts/controller/index.js
const { QuizAttempt, Quiz, QuizQuestion, ResponseOption, User, sequelize } = require('../../../models');

// @desc    Submit a quiz attempt
// @route   POST /api/quizzes/:quizId/attempts
// @access  Private (Utilisateur qui peut accéder au quiz)
exports.submitQuizAttempt = async (req, res, next) => {
    const { quizId } = req.params;
    const utilisateur_id = req.user.id;
    const userAnswers = req.body.answers;

    if (!userAnswers || !Array.isArray(userAnswers)) {
        return res.status(400).json({ message: "Les réponses ('answers') doivent être un tableau." });
    }

    try {
        const quiz = await Quiz.findByPk(quizId, {
            include: [{
                model: QuizQuestion,       // 1. Est-ce que QuizQuestion est bien importé ici ? Oui, en haut.
                as: 'QuestionsQuizzes',    // 2. EST-CE L'ALIAS CORRECT POUR L'ASSOCIATION Quiz.hasMany(QuizQuestion) ?
                include: [{
                    model: ResponseOption, // 3. Est-ce que ResponseOption est bien importé ici ? Oui.
                    as: 'OptionsReponses'  // 4. EST-CE L'ALIAS CORRECT POUR QuizQuestion.hasMany(ResponseOption) ?
                }]
            }]
        });

        // === AJOUTER CE DÉBOGAGE IMMÉDIATEMENT APRÈS LE CHARGEMENT DU QUIZ ===
        if (!quiz) {
            console.error(`submitQuizAttempt: Quiz non trouvé pour ID ${quizId}`);
            return res.status(404).json({ message: "Quiz non trouvé." });
        }
        console.log("Dans submitQuizAttempt, Objet Quiz CHARGÉ:", JSON.stringify(quiz, null, 2));
        if (!quiz.QuestionsQuizzes || !Array.isArray(quiz.QuestionsQuizzes)) {
             console.error("ERREUR CRITIQUE DANS submitQuizAttempt: quiz.QuestionsQuizzes n'est pas un tableau ou est manquant !");
             console.error("Clés disponibles sur l'objet quiz:", Object.keys(quiz.get({plain:true}))); // Pour voir les clés disponibles
             // Cela va probablement causer le crash suivant si on ne retourne pas une erreur ici
             return res.status(500).json({ message: "Erreur interne lors du chargement des questions du quiz pour la soumission."});
        }
        // ====================================================================


        // Si le code arrive ici, quiz.QuestionsQuizzes doit être un array
        let score = 0;
        let totalPossibleScore = 0;

        for (const question of quiz.QuestionsQuizzes) { // La ligne qui plante (ligne 30 après vos modifs)
            totalPossibleScore += 1;
            const userAnswer = userAnswers.find(ans => ans['question_id'] === question.id); // Utiliser ['question_id'] pour plus de sûreté

            if (userAnswer && userAnswer['option_id'] != null) { // S'assurer que option_id existe
                if (question.type_question === 'QCM' || question.type_question === 'VRAI_FAUX') {
                    if (!question.OptionsReponses || !Array.isArray(question.OptionsReponses)) {
                        console.error(`ERREUR CRITIQUE DANS submitQuizAttempt: question.OptionsReponses n'est pas un tableau pour question ID ${question.id}`);
                        continue; // Passer à la question suivante si les options sont manquantes
                    }
                    const correctOption = question.OptionsReponses.find(opt => opt.est_correcte === true);
                    if (correctOption && userAnswer['option_id'] === correctOption.id) {
                        score += 1;
                    }
                }
            }
        }
        // ... (reste de la fonction)
        const score_pourcentage = totalPossibleScore > 0 ? (score / totalPossibleScore) * 100 : 0;
        console.log("Avant QuizAttempt.create. Données:", { utilisateur_id, quiz_id: parseInt(quizId), score_obtenu: score_pourcentage.toFixed(2), reponses_utilisateur: userAnswers });
        const attempt = await QuizAttempt.create({
            utilisateur_id,
            quiz_id: parseInt(quizId),
            score_obtenu: score_pourcentage.toFixed(2),
            reponses_utilisateur: userAnswers // Sequelize devrait gérer la sérialisation en JSON pour ce champ si le type est DataTypes.JSON
        });
        console.log("Après QuizAttempt.create. Tentative créée:", JSON.stringify(attempt, null, 2));
        // === FIN POINT D'ARRÊT POTENTIEL N°1 ===

        // === POINT D'ARRÊT POTENTIEL N°2 : Envoi de la réponse ===
        res.status(201).json({
            message: "Tentative soumise.",
            attempt: attempt.get({ plain: true }), // Utilisez .get({ plain: true }) pour un objet simple
            score: score,
            totalPossibleScore: totalPossibleScore,
            scorePourcentage: parseFloat(score_pourcentage.toFixed(2)),
            // Assurez-vous que quiz.seuil_reussite_pourcentage est un nombre ici
            passed: quiz.seuil_reussite_pourcentage ? (score_pourcentage >= parseFloat(quiz.seuil_reussite_pourcentage.toString())) : null
        });
        console.log("Réponse envoyée au client après soumission de la tentative."); // Pour confirmer que res.json a été appelé
        // === FIN POINT D'ARRÊT POTENTIEL N°2 ===
        // ... (create attempt, res.json)
    } catch (error) {
        console.error("ERREUR DANS submitQuizAttempt (catch général):", error);
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