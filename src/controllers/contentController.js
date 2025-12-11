import { supabaseAdmin } from '../config/supabase.js';
import { sendError, sendSuccess } from '../utils/response.js';

const pickFields = (payload, allowed = []) => {
  const result = {};
  allowed.forEach((field) => {
    if (payload[field] !== undefined) {
      result[field] = payload[field];
    }
  });
  return result;
};

const createListHandler = (table, searchColumns = []) => async (req, res) => {
  try {
    const { search = '' } = req.query;
    let query = supabaseAdmin.from(table).select('*').order('created_at', {
      ascending: false,
    });

    if (search && searchColumns.length) {
      const orFilters = searchColumns.map((col) => `${col}.ilike.%${search}%`).join(',');
      query = query.or(orFilters);
    }

    const { data, error } = await query;

    if (error) {
      return sendError(res, {
        message: `Unable to load ${table}.`,
        errorCode: `${table.toUpperCase()}_LIST_FAILED`,
        details: error.message,
      });
    }

    return sendSuccess(res, {
      message: `${table} loaded.`,
      data,
    });
  } catch (err) {
    return sendError(res, {
      message: `Unexpected error loading ${table}.`,
      errorCode: `${table.toUpperCase()}_LIST_ERROR`,
      details: err.message,
    });
  }
};

const createSingleGetter = (table) => async (req, res) => {
  const { idOrSlug } = req.params;

  try {
    const query = supabaseAdmin.from(table).select('*').limit(1);
    const isUUID = /^[0-9a-fA-F-]{36}$/.test(idOrSlug);
    if (isUUID) {
      query.eq('id', idOrSlug);
    } else {
      query.eq('slug', idOrSlug);
    }

    const { data, error } = await query.single();

    if (error) {
      return sendError(res, {
        status: 404,
        message: `${table} not found.`,
        errorCode: `${table.toUpperCase()}_NOT_FOUND`,
      });
    }

    return sendSuccess(res, {
      message: `${table} fetched.`,
      data,
    });
  } catch (err) {
    return sendError(res, {
      message: `Unexpected error fetching ${table}.`,
      errorCode: `${table.toUpperCase()}_FETCH_ERROR`,
      details: err.message,
    });
  }
};

const createCreateHandler = (table, allowedFields = []) => async (req, res) => {
  const payload = pickFields(req.body, allowedFields);

  if (!Object.keys(payload).length) {
    return sendError(res, {
      status: 400,
      message: 'No valid fields supplied.',
      errorCode: `${table.toUpperCase()}_VALIDATION_FAILED`,
    });
  }

  try {
    const { data, error } = await supabaseAdmin.from(table).insert(payload).select().single();

    if (error) {
      return sendError(res, {
        message: `Unable to create ${table}.`,
        errorCode: `${table.toUpperCase()}_CREATE_FAILED`,
        details: error.message,
      });
    }

    return sendSuccess(res, {
      status: 201,
      message: '✨ Created successfully.',
      data,
    });
  } catch (err) {
    return sendError(res, {
      message: `Unexpected error creating ${table}.`,
      errorCode: `${table.toUpperCase()}_CREATE_ERROR`,
      details: err.message,
    });
  }
};

const createUpdateHandler = (table, allowedFields = []) => async (req, res) => {
  const { id } = req.params;
  const payload = pickFields(req.body, allowedFields);

  if (!id) {
    return sendError(res, {
      status: 400,
      message: 'ID parameter is required.',
      errorCode: `${table.toUpperCase()}_ID_REQUIRED`,
    });
  }

  if (!Object.keys(payload).length) {
    return sendError(res, {
      status: 400,
      message: 'Provide at least one field to update.',
      errorCode: `${table.toUpperCase()}_VALIDATION_FAILED`,
    });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from(table)
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return sendError(res, {
        message: `Unable to update ${table}.`,
        errorCode: `${table.toUpperCase()}_UPDATE_FAILED`,
        details: error.message,
      });
    }

    return sendSuccess(res, {
      message: '🔁 Updated successfully.',
      data,
    });
  } catch (err) {
    return sendError(res, {
      message: `Unexpected error updating ${table}.`,
      errorCode: `${table.toUpperCase()}_UPDATE_ERROR`,
      details: err.message,
    });
  }
};

const createDeleteHandler = (table) => async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return sendError(res, {
      status: 400,
      message: 'ID parameter is required.',
      errorCode: `${table.toUpperCase()}_ID_REQUIRED`,
    });
  }

  try {
    const { error } = await supabaseAdmin.from(table).delete().eq('id', id);

    if (error) {
      return sendError(res, {
        message: `Unable to delete from ${table}.`,
        errorCode: `${table.toUpperCase()}_DELETE_FAILED`,
        details: error.message,
      });
    }

    return sendSuccess(res, {
      message: '🗑️ Deleted successfully.',
    });
  } catch (err) {
    return sendError(res, {
      message: `Unexpected error deleting from ${table}.`,
      errorCode: `${table.toUpperCase()}_DELETE_ERROR`,
      details: err.message,
    });
  }
};

export const getAbout = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('about')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return sendError(res, {
        message: 'Unable to load about section.',
        errorCode: 'ABOUT_FETCH_FAILED',
        details: error.message,
      });
    }

    return sendSuccess(res, {
      message: 'About loaded.',
      data,
    });
  } catch (err) {
    return sendError(res, {
      message: 'Unexpected error loading about.',
      errorCode: 'ABOUT_FETCH_ERROR',
      details: err.message,
    });
  }
};

export const upsertAbout = async (req, res) => {
  const payload = pickFields(req.body, [
    'id',
    'headline',
    'bio',
    'highlight',
    'resume_url',
    'profile_image_url',
    'socials',
  ]);

  if (!payload.headline || !payload.bio) {
    return sendError(res, {
      status: 400,
      message: 'Headline and bio are required.',
      errorCode: 'ABOUT_VALIDATION_FAILED',
    });
  }

  if (payload.highlight && !Array.isArray(payload.highlight)) {
    payload.highlight = [];
  }

  if (payload.socials && !Array.isArray(payload.socials)) {
    payload.socials = [];
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('about')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      return sendError(res, {
        message: 'Unable to save about content.',
        errorCode: 'ABOUT_SAVE_FAILED',
        details: error.message,
      });
    }

    return sendSuccess(res, {
      message: 'About updated.',
      data,
    });
  } catch (err) {
    return sendError(res, {
      message: 'Unexpected error saving about content.',
      errorCode: 'ABOUT_SAVE_ERROR',
      details: err.message,
    });
  }
};

export const listSkills = createListHandler('skills', ['name', 'category']);
export const createSkill = createCreateHandler('skills', [
  'name',
  'category',
  'proficiency',
  'icon_url',
]);
export const updateSkill = createUpdateHandler('skills', [
  'name',
  'category',
  'proficiency',
  'icon_url',
]);
export const deleteSkill = createDeleteHandler('skills');

export const listProjects = createListHandler('projects', ['title', 'summary']);
export const getProject = createSingleGetter('projects');
export const createProject = createCreateHandler('projects', [
  'title',
  'slug',
  'summary',
  'description',
  'live_url',
  'repo_url',
  'preview_image_url',
  'preview_url',
  'tech_stack',
  'featured',
  'started_on',
  'completed_on',
]);
export const updateProject = createUpdateHandler('projects', [
  'title',
  'slug',
  'summary',
  'description',
  'live_url',
  'repo_url',
  'preview_image_url',
  'preview_url',
  'tech_stack',
  'featured',
  'started_on',
  'completed_on',
]);
export const deleteProject = createDeleteHandler('projects');

export const listBlogs = createListHandler('blogs', ['title', 'excerpt']);
export const getBlog = createSingleGetter('blogs');
export const createBlog = createCreateHandler('blogs', [
  'title',
  'slug',
  'excerpt',
  'content',
  'published_at',
  'preview_image_url',
  'readme',
  'status',
]);
export const updateBlog = createUpdateHandler('blogs', [
  'title',
  'slug',
  'excerpt',
  'content',
  'published_at',
  'preview_image_url',
  'readme',
  'status',
]);
export const deleteBlog = createDeleteHandler('blogs');

export const listExperience = createListHandler('experience', ['company', 'title']);
export const createExperience = createCreateHandler('experience', [
  'company',
  'title',
  'start_date',
  'end_date',
  'location',
  'description',
  'skills',
]);
export const updateExperience = createUpdateHandler('experience', [
  'company',
  'title',
  'start_date',
  'end_date',
  'location',
  'description',
  'skills',
]);
export const deleteExperience = createDeleteHandler('experience');

export const listEducation = createListHandler('education', ['institution', 'degree', 'field']);
export const createEducation = createCreateHandler('education', [
  'institution',
  'degree',
  'field',
  'start_date',
  'end_date',
  'location',
  'description',
  'skills',
]);
export const updateEducation = createUpdateHandler('education', [
  'institution',
  'degree',
  'field',
  'start_date',
  'end_date',
  'location',
  'description',
  'skills',
]);
export const deleteEducation = createDeleteHandler('education');

export const listAwards = createListHandler('awards', ['title', 'issuer']);
export const createAward = createCreateHandler('awards', [
  'title',
  'issuer',
  'issued_on',
  'location',
  'description',
]);
export const updateAward = createUpdateHandler('awards', [
  'title',
  'issuer',
  'issued_on',
  'location',
  'description',
]);
export const deleteAward = createDeleteHandler('awards');

export const listCertificates = createListHandler('certificates', ['title', 'issuer']);
export const createCertificate = createCreateHandler('certificates', [
  'title',
  'issuer',
  'issued_on',
  'credential_id',
  'credential_url',
  'description',
]);
export const updateCertificate = createUpdateHandler('certificates', [
  'title',
  'issuer',
  'issued_on',
  'credential_id',
  'credential_url',
  'description',
]);
export const deleteCertificate = createDeleteHandler('certificates');

export const listTestimonials = createListHandler('testimonials', ['author', 'company']);
export const createTestimonial = createCreateHandler('testimonials', [
  'author',
  'role',
  'company',
  'content',
  'highlight',
]);
export const updateTestimonial = createUpdateHandler('testimonials', [
  'author',
  'role',
  'company',
  'content',
  'highlight',
]);
export const deleteTestimonial = createDeleteHandler('testimonials');

export const listServices = createListHandler('services', ['title', 'description']);
export const createService = createCreateHandler('services', [
  'title',
  'description',
  'price_range',
  'duration',
  'image_url',
]);
export const updateService = createUpdateHandler('services', [
  'title',
  'description',
  'price_range',
  'duration',
  'image_url',
]);
export const deleteService = createDeleteHandler('services');
