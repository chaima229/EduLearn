const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/db'); // Import l'instance de sequelize

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importer les modèles
db.User = require('./User')(sequelize, Sequelize);
db.CategoryCourse = require('./CategoryCourse')(sequelize, Sequelize);
db.Course = require('./Course')(sequelize, Sequelize);
db.Lesson = require('./Lesson')(sequelize, Sequelize);
db.CourseEnrollment = require('./CourseEnrollment')(sequelize, Sequelize);
db.LessonProgress = require('./LessonProgress')(sequelize, Sequelize);
db.Quiz = require('./Quiz')(sequelize, Sequelize);
db.QuizQuestion = require('./QuizQuestion')(sequelize, Sequelize);
db.ResponseOption = require('./ResponseOption')(sequelize, Sequelize);
db.QuizAttempt = require('./QuizAttempt')(sequelize, Sequelize);
db.Certificate = require('./Certificate')(sequelize, Sequelize);
db.UserCertificate = require('./UserCertificate')(sequelize, Sequelize);
db.ForumTopic = require('./ForumTopic')(sequelize, Sequelize);
db.ForumMessage = require('./ForumMessage')(sequelize, Sequelize);

// Définir les associations
// Utilisateurs
db.User.hasMany(db.Course, { foreignKey: 'instructeur_id', as: 'taughtCourses' });
db.User.hasMany(db.CourseEnrollment, { foreignKey: 'utilisateur_id' });
db.User.hasMany(db.QuizAttempt, { foreignKey: 'utilisateur_id' });
db.User.hasMany(db.UserCertificate, { foreignKey: 'utilisateur_id' });
db.User.hasMany(db.ForumTopic, { foreignKey: 'utilisateur_id_createur' });
db.User.hasMany(db.ForumMessage, { foreignKey: 'utilisateur_id_auteur' });

// CategoriesCours
db.CategoryCourse.hasMany(db.Course, { foreignKey: 'categorie_id' });

// Cours
db.Course.belongsTo(db.User, { foreignKey: 'instructeur_id', as: 'instructor' });
db.Course.belongsTo(db.CategoryCourse, { foreignKey: 'categorie_id', as: 'category' });
db.Course.hasMany(db.Lesson, { foreignKey: 'cours_id' });
db.Course.hasMany(db.CourseEnrollment, { foreignKey: 'cours_id' });
db.Course.hasMany(db.Quiz, { foreignKey: 'cours_id', as: 'courseQuizzes' }); // Quiz liés directement au cours
db.Course.hasOne(db.Certificate, { foreignKey: 'cours_id' });
db.Course.hasMany(db.UserCertificate, { foreignKey: 'cours_id' }); // Redondant mais pratique
db.Course.hasMany(db.ForumTopic, { foreignKey: 'cours_id' });

// Lecons
db.Lesson.belongsTo(db.Course, { foreignKey: 'cours_id', as: 'courseForLesson' });
db.Lesson.hasMany(db.LessonProgress, { foreignKey: 'lecon_id' });
db.Lesson.hasMany(db.Quiz, { foreignKey: 'lecon_id', as: 'lessonQuizzes' }); // Quiz liés à une leçon


// InscriptionsCours
db.CourseEnrollment.belongsTo(db.User, { foreignKey: 'utilisateur_id' });
db.CourseEnrollment.belongsTo(db.Course, { foreignKey: 'cours_id' });
db.CourseEnrollment.hasMany(db.LessonProgress, { foreignKey: 'inscription_cours_id' });

// ProgressionLecons
db.LessonProgress.belongsTo(db.CourseEnrollment, { foreignKey: 'inscription_cours_id' });
db.LessonProgress.belongsTo(db.Lesson, { foreignKey: 'lecon_id' });

// Quiz
db.Quiz.belongsTo(db.Lesson, { foreignKey: 'lecon_id', as: 'lesson', constraints: false }); // constraints: false car lecon_id peut être NULL
db.Quiz.belongsTo(db.Course, { foreignKey: 'cours_id', as: 'course', constraints: false }); // constraints: false car cours_id peut être NULL
db.Quiz.hasMany(db.QuizQuestion, { foreignKey: 'quiz_id', as: 'QuestionsQuizzes' });
db.Quiz.hasMany(db.QuizAttempt, { foreignKey: 'quiz_id' });

// QuestionsQuiz
db.QuizQuestion.belongsTo(db.Quiz, { foreignKey: 'quiz_id' });
db.QuizQuestion.hasMany(db.ResponseOption, { foreignKey: 'question_id', as: 'OptionsReponses' });

// OptionsReponse
db.ResponseOption.belongsTo(db.QuizQuestion, { foreignKey: 'question_id' });

// TentativesQuiz
db.QuizAttempt.belongsTo(db.User, { foreignKey: 'utilisateur_id' });
db.QuizAttempt.belongsTo(db.Quiz, { foreignKey: 'quiz_id' });

// Certificats
db.Certificate.belongsTo(db.Course, { foreignKey: 'cours_id' });
db.Certificate.hasMany(db.UserCertificate, { foreignKey: 'certificat_id' });

// CertificatsUtilisateur
db.UserCertificate.belongsTo(db.User, {
    foreignKey: 'utilisateur_id',
    as: 'utilisateur' // Définir l'alias ici !
});
db.UserCertificate.belongsTo(db.Certificate, { foreignKey: 'certificat_id' });
db.UserCertificate.belongsTo(db.Course, { foreignKey: 'cours_id' }); // Redondant mais pratique


// ForumSujets
db.ForumTopic.belongsTo(db.Course, { foreignKey: 'cours_id', as: 'course' });
db.ForumTopic.belongsTo(db.User, { foreignKey: 'utilisateur_id_createur', as: 'creator' });
db.ForumTopic.hasMany(db.ForumMessage, { foreignKey: 'sujet_id' });

// ForumMessages
db.ForumMessage.belongsTo(db.ForumTopic, { foreignKey: 'sujet_id' });
db.ForumMessage.belongsTo(db.User, { foreignKey: 'utilisateur_id_auteur', as: 'author' });
db.ForumMessage.belongsTo(db.ForumMessage, { foreignKey: 'message_parent_id', as: 'parentMessage' });
db.ForumMessage.hasMany(db.ForumMessage, { foreignKey: 'message_parent_id', as: 'replies' });

//Notifications
db.Notification = require('./Notification')(sequelize, Sequelize);


module.exports = db;