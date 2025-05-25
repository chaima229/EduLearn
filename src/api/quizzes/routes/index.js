// src/api/quizzes/routes/index.js
const express = require('express');
const router = express.Router();
const quizController = require('../controller');
const myCustomAuthMiddleware = require('../../../middleware/authMiddleware');
const quizAttemptRoutesForQuiz = require('../quizAttemptRoutes');


// Routes pour les Quiz
router.route('/:id')
    .get(myCustomAuthMiddleware, quizController.getQuizById) // Le ctrl gère si user peut voir (et si les réponses sont masquées)
    .put(myCustomAuthMiddleware, quizController.updateQuiz) // Le ctrl gère les droits de modif
    .delete(myCustomAuthMiddleware, quizController.deleteQuiz); // Le ctrl gère les droits de suppression

// Route pour ajouter une question à un quiz existant
router.post('/:quizId/questions', myCustomAuthMiddleware, quizController.addQuestionToQuiz);

// Routes dédiées pour QuizQuestions (si on y accède par leur ID direct)
// Ces routes devraient peut-être être dans un fichier séparé sous quizzes/
// ou dans un module api/quiz-questions/
// Pour l'instant, on les laisse ici pour simplifier un peu,
// mais en pratique, les regrouper par entité est mieux.
router.route('/questions/:questionId') // Ou '/quiz-questions/:questionId'
    .put(myCustomAuthMiddleware, quizController.updateQuizQuestion)
    .delete(myCustomAuthMiddleware, quizController.deleteQuizQuestion);

// Note: La création de quiz est gérée via des routes imbriquées sous /courses ou /lessons
// Exemple pour `api/courses/routes/index.js`:
// const courseQuizRoutes = require('./courseQuizRoutes'); // À créer
// router.use('/:courseId/quizzes', courseQuizRoutes);

// Exemple pour `api/lessons/routes/index.js` s'il a des quiz aussi (non fait dans ce modèle)
// const lessonQuizRoutes = require('../quizzes/lessonQuizRoutes');
// router.use('/:lessonId/quizzes', lessonQuizRoutes);




router.use('/:quizId/attempts', quizAttemptRoutesForQuiz);
module.exports = router;