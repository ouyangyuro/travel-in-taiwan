import {
  GOOGLE_SITE_VERIFICATION,
  GOOGLE_CLIENT_ID,
  FB_APP_ID,
} from 'src/config/config';

/** ---------------------------------------------------------------------------------------------------------------------
 * Config: head's meta
 * @return {object}
 */

const siteMetaData = {
  title: 'Travel In Taiwan',
  keywords: '台灣、旅遊、找去處、Travel、Taiwan、Travel In Taiwan',
  description:
    'Travel In Taiwan 提供所有台灣旅遊好去處的吃、喝、玩、樂活動資訊。',
  google_site_verification: `${GOOGLE_SITE_VERIFICATION}`,
  fb_app_id: `${FB_APP_ID}`,
  google_client_id: `${GOOGLE_CLIENT_ID}`,
  image: '/images/icon.png',
  iss: 'vercel.app',
};

export default siteMetaData;
