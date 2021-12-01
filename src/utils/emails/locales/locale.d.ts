export interface Locale {
  hf_team: string;
  subject: string;
  get_help: string;
  twitter_account: string;
  salutations: string;
}

interface CheckEmailSpecific {
  thanks: string;
  please_verify: string;
  button: string;
}

interface ResetPasswordSpecific {
  you_asked_for_reset: string;
  if_you_not_asked: string;
  if_you_asked: string;
  follow_instructions: string;
  button: string;
}

export type CheckEmail = CheckEmailSpecific & Locale;
export type ResetPassword = ResetPasswordSpecific & Locale;
