import { supabaseAdmin } from '../config/supabase.js';
import { sendError, sendSuccess } from '../utils/response.js';

export const submitContact = async (req, res) => {
  const { fullname, email, subject, message } = req.validatedBody || req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert({
        fullname,
        email,
        subject,
        body: message,
      })
      .select()
      .single();

    if (error) {
      return sendError(res, {
        message: 'Unable to submit message.',
        errorCode: 'CONTACT_SUBMIT_FAILED',
        details: error.message,
      });
    }

    console.log('📩 New contact message:', data);

    return sendSuccess(res, {
      status: 201,
      message: '✅ Message sent successfully. Expect a reply soon.',
      data,
    });
  } catch (err) {
    return sendError(res, {
      message: 'Unexpected error while submitting contact form.',
      errorCode: 'CONTACT_SUBMIT_ERROR',
      details: err.message,
    });
  }
};

export const listMessages = async (req, res) => {
  const { search = '' } = req.validatedQuery || req.query;

  try {
    const query = supabaseAdmin.from('messages').select('*').order('created_at', {
      ascending: false,
    });

    if (search) {
      query.or(`fullname.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return sendError(res, {
        message: 'Failed to load messages.',
        errorCode: 'CONTACT_LIST_FAILED',
        details: error.message,
      });
    }

    return sendSuccess(res, {
      message: 'Messages loaded.',
      data,
    });
  } catch (err) {
    return sendError(res, {
      message: 'Unexpected error loading messages.',
      errorCode: 'CONTACT_LIST_ERROR',
      details: err.message,
    });
  }
};

export const deleteMessage = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return sendError(res, {
      status: 400,
      message: 'ID parameter is required.',
      errorCode: 'MESSAGES_ID_REQUIRED',
    });
  }

  try {
    const { error } = await supabaseAdmin.from('messages').delete().eq('id', id);

    if (error) {
      return sendError(res, {
        message: 'Unable to delete message.',
        errorCode: 'MESSAGES_DELETE_FAILED',
        details: error.message,
      });
    }

    return sendSuccess(res, {
      message: '🗑️ Deleted successfully.',
    });
  } catch (err) {
    return sendError(res, {
      message: 'Unexpected error deleting message.',
      errorCode: 'MESSAGES_DELETE_ERROR',
      details: err.message,
    });
  }
};
