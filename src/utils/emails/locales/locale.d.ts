export interface Locale {
  hf_team: string;
  subject: string;
}

interface CheckEmailSpecific {
  thanks: string;
  please_verify: string;
  button: string;
  get_help: string;
  salutations: string;
}

interface ResetPasswordSpecific {
  you_asked_for_reset: string;
  if_you_not_asked: string;
  if_you_asked: string;
  follow_instructions: string;
  button: string;
  get_help: string;
  salutations: string;
}

export type CheckEmail = CheckEmailSpecific & Locale;
export type ResetPassword = ResetPasswordSpecific & Locale;
