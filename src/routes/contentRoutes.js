import { Router } from 'express';
import {
  createBlog,
  createExperience,
  createEducation,
  createProject,
  createService,
  createSkill,
  createTestimonial,
  createAward,
  createCertificate,
  deleteBlog,
  deleteExperience,
  deleteEducation,
  deleteProject,
  deleteService,
  deleteSkill,
  deleteTestimonial,
  deleteAward,
  deleteCertificate,
  getAbout,
  getBlog,
  getProject,
  listBlogs,
  listExperience,
  listEducation,
  listProjects,
  listServices,
  listSkills,
  listTestimonials,
  listAwards,
  listCertificates,
  upsertAbout,
  updateBlog,
  updateExperience,
  updateEducation,
  updateProject,
  updateService,
  updateSkill,
  updateTestimonial,
  updateAward,
  updateCertificate,
} from '../controllers/contentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/about', getAbout);
router.put('/about', authenticate, upsertAbout);

router.get('/skills', listSkills);
router.post('/skills', authenticate, createSkill);
router.put('/skills/:id', authenticate, updateSkill);
router.delete('/skills/:id', authenticate, deleteSkill);

router.get('/projects', listProjects);
router.get('/projects/:idOrSlug', getProject);
router.post('/projects', authenticate, createProject);
router.put('/projects/:id', authenticate, updateProject);
router.delete('/projects/:id', authenticate, deleteProject);

router.get('/blogs', listBlogs);
router.get('/blogs/:idOrSlug', getBlog);
router.post('/blogs', authenticate, createBlog);
router.put('/blogs/:id', authenticate, updateBlog);
router.delete('/blogs/:id', authenticate, deleteBlog);

router.get('/experience', listExperience);
router.post('/experience', authenticate, createExperience);
router.put('/experience/:id', authenticate, updateExperience);
router.delete('/experience/:id', authenticate, deleteExperience);

router.get('/education', listEducation);
router.post('/education', authenticate, createEducation);
router.put('/education/:id', authenticate, updateEducation);
router.delete('/education/:id', authenticate, deleteEducation);

router.get('/testimonials', listTestimonials);
router.post('/testimonials', authenticate, createTestimonial);
router.put('/testimonials/:id', authenticate, updateTestimonial);
router.delete('/testimonials/:id', authenticate, deleteTestimonial);

router.get('/services', listServices);
router.post('/services', authenticate, createService);
router.put('/services/:id', authenticate, updateService);
router.delete('/services/:id', authenticate, deleteService);

router.get('/awards', listAwards);
router.post('/awards', authenticate, createAward);
router.put('/awards/:id', authenticate, updateAward);
router.delete('/awards/:id', authenticate, deleteAward);

router.get('/certificates', listCertificates);
router.post('/certificates', authenticate, createCertificate);
router.put('/certificates/:id', authenticate, updateCertificate);
router.delete('/certificates/:id', authenticate, deleteCertificate);

export default router;
