import { environment } from 'src/environments/environment';

export class ApiPathConstant {
  public static SEND_MAIL = 'commons/emailServices/private/saveEmail';
  public static REPLAY_MAIL = 'commons/emailServices/private/replyEmail';
  public static EDIT_MAIL = 'commons/emailServices/private/editEmail';
  public static DRAFT_MAIL = 'commons/emailServices/private/saveEmail';
  public static GET_INBOX_LISTING = 'commons/emailServices/private/getEmailInboxList';
  public static GET_DRAFT_LISTING = 'commons/emailServices/private/getEmailDraftList';
  public static GET_SENT_LISTING = 'commons/emailServices/private/getSendList';
  public static GET_STARRED_LISTING = 'commons/emailServices/private/getStarredList';
  public static GET_TRASH_LISTING = 'commons/emailServices/private/getTrashList';
  public static GET_MAIL_VIEW = 'commons/emailServices/private/viewMail';
  public static GET_MAIL_DETAILS = 'commons/emailServices/private/getMailDetails';
  public static GET_CATEGORY = 'setup/generalMasters/mailCategory/private/getCategoryList';
  public static GET_SUB_CATEGORY = 'setup/generalMasters/mailCategory/private/getSubCategoryList';
  public static GET_TRIMMED_CONTENT = 'commons/emailServices/private/showTrailMail';
  public static MARK_AS_STARED = 'commons/emailServices/private/markAsFavourite';
  public static MARK_AS_UNSTARED = 'ServiceAPI/emailServices/private/markAsNonFavourite';
  public static MARK_AS_READ = 'commons/emailServices/private/markAsRead';
  public static MARK_AS_UNREAD = 'commons/emailServices/private/markAsUnRead';
  public static MARK_AS_DELETE = 'commons/emailServices/private/deleteEmail';
  public static GET_MAIL_CORPORATE = 'commons/emailServices/private/getCorporateUsers';
  public static GET_MAIL_BANK = 'commons/emailServices/private/getBankUsers';
  public static GET_SIDE_NAV = 'commons/emailServices/private/getListingCounts';
}
