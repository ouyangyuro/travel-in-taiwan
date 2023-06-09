import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';

import moment from 'moment-timezone';

import SEO from '@utils/seo';
import EmptyLayout from '@layout/emptyLayout';

import BackBtnWithTitleAndCopy from 'src/features/detail/components/backBtnWithTitleAndCopy';
import BasicInfo from 'src/features/detail/components/basicInfo';
import SpotIntroduce from 'src/features/detail/components/spotIntroduce';
import TransportInfo from 'src/features/detail/components/transportInfo';
import NearbySpot from 'src/features/detail/components/nearbySpot';

import getScenicSpotAPI from 'src/api/getScenicSpotAPI';
import getActivityAPI from 'src/api/getActivityAPI';
import getRestaurantAPI from 'src/api/getRestaurantAPI';
import getHotelAPI from 'src/api/getHotelAPI';

import styles from './index.module.scss';

export default function Detail({ data }) {
  /** ---------------------------------------------------------------------------------------------
   * SSR State
   * @type {string}     QueryType             query ('scenicSpot', 'restaurant', 'hotel', 'activity')
   * @type {string}     Address               地址
   * @type {string}     City                  城市
   * @type {string}     Location              位置
   * @type {string}     Description           簡介
   * @type {string}     DescriptionDetail     詳細介紹
   * @type {string}     OpenTime              開放時間
   * @type {object}     ParkingPosition       停車地點
   * @type {string}     Phone                 聯絡電話
   * @type {object}     Picture               照片
   * @type {object}     Position              所在地
   * @type {string}     Remarks               注意事項
   * @type {string}     SpotID                觀光資訊的 ID
   * @type {string}     SpotName              觀光資訊的標題
   * @type {string}     WebsiteUrl            觀光資訊的官網
   * @type {string}     SrcUpdateTime         資料來源更新時間
   * @type {string}     TicketInfo            收費資訊
   * @type {string}     TravelInfo            旅行交通資訊
   * @type {string}     UpdateTime            更新時間
   * @type {string}     ZipCode               郵遞區號
   */
  const {
    QueryType,
    Address,
    City,
    Location,
    Description,
    DescriptionDetail,
    OpenTime,
    ParkingPosition,
    Phone,
    Picture,
    Position,
    Remarks,
    SpotID,
    SpotName,
    WebsiteUrl,
    SrcUpdateTime,
    TicketInfo,
    TravelInfo,
    UpdateTime,
    ZipCode,
  } = data.detailData;

  /** ---------------------------------------------------------------------------------------------
   * diff queryType bgcolor
   */
  const handleTypeBgColor = () => {
    switch (QueryType) {
      case 'scenicSpot':
        return;
      case 'restaurant':
        return 'var(--pale_quaternary)';
      case 'hotel':
        return 'var(--pale_tertiary)';
      case 'activity':
        return 'var(--pale_secondary)';

      default:
        console.log('No match color'); //FIXME:
    }
  };

  /** ---------------------------------------------------------------------------------------------
   * diff queryType title color
   */
  const handleTitleColor = () => {
    switch (QueryType) {
      case 'scenicSpot':
        return;
      case 'restaurant':
        return 'var(--quaternary)';
      case 'hotel':
        return 'var(--tertiary)';
      case 'activity':
        return 'var(--secondary)';

      default:
        console.log('No match color'); //FIXME:
    }
  };

  // ---------------------------------------------------------------------------------------------

  return (
    <>
      <SEO title={SpotName} />

      <div className="w-full h-full">
        <div className={`${styles.box} w-full h-full px-4 pt-4 pb-8`}>
          <BackBtnWithTitleAndCopy spotName={SpotName} />
          <Image
            src={Picture.PictureUrl1}
            alt={Picture.PictureDescription1}
            width="0"
            height="0"
            sizes="100vw"
            className={`w-full h-40 ipad:h-80 desktop:h-96 mt-5 rounded`}
            style={{ objectFit: 'cover' }}
            placeholder="blur"
            blurDataURL={'/images/logo-loading.png'}
          />
          {/* <img
            src={Picture.PictureUrl1}
            // FIXME: google drive 要額外處理 src="https://drive.google.com/uc?export=view&id=1sTBlDyxqpVFArapy8jDR_gC_SeWjgqJa"
            alt={Picture.PictureDescription1}
            className={`w-full h-40 ipad:h-80 desktop:h-96 mt-5 rounded`}
            style={{ objectFit: 'cover' }}
          /> TODO: 保留因為next image 不穩定 */}
          {/* <div
            className={`w-full h-40 ipad:h-80 desktop:h-96 mt-5 rounded`}
            style={{
              backgroundImage: `url("${Picture.PictureUrl1}")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          ></div> TODO: 保留因為next image 不穩定 */}
          <BasicInfo
            address={Address}
            openTime={OpenTime}
            phone={Phone}
            backgroundColor={handleTypeBgColor()}
            iconColor={handleTitleColor()}
          />
          <SpotIntroduce
            queryType={QueryType}
            descriptionDetail={DescriptionDetail ?? Description}
            titleColor={handleTitleColor()}
          />
          <TransportInfo
            travelInfo={TravelInfo}
            position={Position}
            titleColor={handleTitleColor()}
          />
          <NearbySpot
            queryType={QueryType}
            position={Position}
            spotID={SpotID}
            titleColor={handleTitleColor()}
          />
        </div>
      </div>
    </>
  );
}

Detail.getLayout = function getLayout(page) {
  return <EmptyLayout>{page}</EmptyLayout>;
};

export async function getServerSideProps({ params, query, locale }) {
  const { type } = params;
  const { did } = query;

  let detailData = {
    Address: undefined,
    City: undefined,
    Location: undefined,
    Description: undefined,
    DescriptionDetail: undefined,
    OpenTime: undefined,
    ParkingPosition: undefined,
    Phone: undefined,
    Picture: undefined,
    Position: undefined,
    Remarks: undefined,
    SpotID: undefined,
    SpotName: undefined,
    WebsiteUrl: undefined,
    SrcUpdateTime: undefined,
    TicketInfo: undefined,
    TravelInfo: undefined,
    UpdateTime: undefined,
    ZipCode: undefined,
  };

  let responseData;

  switch (type) {
    // --------------------------------------------------------
    // scenicSpot: call API 取得特定觀光景點資料
    case 'scenicSpot': {
      responseData = await getScenicSpotAPI({
        filter: `ScenicSpotID eq '${did}'`,
      });

      if (responseData?.status === 'success') {
        // handle success (取得觀光景點資料)
        detailData = {
          QueryType: type,
          Address: responseData?.data[0]?.Address ?? null,
          Description: responseData?.data[0]?.Description ?? null,
          DescriptionDetail: responseData?.data[0]?.DescriptionDetail ?? null,
          OpenTime: responseData?.data[0]?.OpenTime ?? null,
          ParkingPosition: responseData?.data[0]?.ParkingPosition ?? null,
          Phone: responseData?.data[0]?.Phone ?? null,
          Picture: responseData?.data[0]?.Picture ?? null,
          Position: responseData?.data[0]?.Position ?? null,
          Remarks: responseData?.data[0]?.Remarks ?? null,
          SpotID: responseData?.data[0]?.ScenicSpotID ?? null,
          SpotName: responseData?.data[0]?.ScenicSpotName ?? null,
          SrcUpdateTime: responseData?.data[0]?.SrcUpdateTime ?? null,
          TicketInfo: responseData?.data[0]?.TicketInfo ?? null,
          TravelInfo: responseData?.data[0]?.TravelInfo ?? null,
          UpdateTime: responseData?.data[0]?.UpdateTime ?? null,
          ZipCode: responseData?.data[0]?.ZipCode ?? null,
        };
      } else {
        // handle error (後端錯誤) -> not found page(404 page)
        return {
          notFound: true,
        };
      }
      break;
    }

    // --------------------------------------------------------
    // restaurant: call API 取得特定觀光餐飲資料
    case 'restaurant': {
      responseData = await getRestaurantAPI({
        filter: `RestaurantID eq '${did}'`,
      });

      if (responseData?.status === 'success') {
        // handle success (取得觀光餐飲資料)
        detailData = {
          QueryType: type,
          Address: responseData?.data[0]?.Address ?? null,
          Description: responseData?.data[0]?.Description ?? null,
          OpenTime: responseData?.data[0]?.OpenTime ?? null,
          Phone: responseData?.data[0]?.Phone ?? null,
          Picture: responseData?.data[0]?.Picture ?? null,
          Position: responseData?.data[0]?.Position ?? null,
          SpotID: responseData?.data[0]?.RestaurantID ?? null,
          SpotName: responseData?.data[0]?.RestaurantName ?? null,
          WebsiteUrl: responseData?.data[0]?.WebsiteUrl ?? null,
          SrcUpdateTime: responseData?.data[0]?.SrcUpdateTime ?? null,
          UpdateTime: responseData?.data[0]?.UpdateTime ?? null,
          ZipCode: responseData?.data[0]?.ZipCode ?? null,
        };
      } else {
        // handle error (後端錯誤) -> not found page(404 page)
        return {
          notFound: true,
        };
      }
      break;
    }

    // --------------------------------------------------------
    // hotel: call API 取得特定觀光旅宿資料
    case 'hotel': {
      responseData = await getHotelAPI({
        filter: `HotelID eq '${did}'`,
      });

      if (responseData?.status === 'success') {
        // handle success (取得觀光旅宿資料)
        detailData = {
          QueryType: type,
          Address: responseData?.data[0]?.Address ?? null,
          Description: responseData?.data[0]?.Description ?? null,
          Phone: responseData?.data[0]?.Phone ?? null,
          Picture: responseData?.data[0]?.Picture ?? null,
          Position: responseData?.data[0]?.Position ?? null,
          SpotID: responseData?.data[0]?.HotelID ?? null,
          SpotName: responseData?.data[0]?.HotelName ?? null,
          WebsiteUrl: responseData?.data[0]?.WebsiteUrl ?? null,
          TravelInfo: responseData?.data[0]?.ParkingInfo ?? null,
          SrcUpdateTime: responseData?.data[0]?.SrcUpdateTime ?? null,
          UpdateTime: responseData?.data[0]?.UpdateTime ?? null,
          ZipCode: responseData?.data[0]?.ZipCode ?? null,
        };
      } else {
        // handle error (後端錯誤) -> not found page(404 page)
        return {
          notFound: true,
        };
      }
      break;
    }

    // --------------------------------------------------------
    // activity: call API 取得特定觀光活動資料
    case 'activity': {
      responseData = await getActivityAPI({
        filter: `ActivityID eq '${did}'`,
      });

      if (responseData?.status === 'success') {
        // handle success (取得觀光活動資料)
        detailData = {
          QueryType: type,
          Address: responseData?.data[0]?.Address ?? null,
          City: responseData?.data[0]?.City ?? null,
          Location: responseData?.data[0]?.Location ?? null,
          Description: responseData?.data[0]?.Description ?? null,
          OpenTime:
            moment(responseData?.data[0]?.StartTime, moment.ISO_8601)
              .tz('Asia/Taipei')
              .format('YYYY-MM-DD') +
            ' ~ ' +
            moment(responseData?.data[0]?.EndTime, moment.ISO_8601)
              .tz('Asia/Taipei')
              .format('YYYY-MM-DD'),
          Phone: responseData?.data[0]?.Phone ?? null,
          Picture: responseData?.data[0]?.Picture ?? null,
          Position: responseData?.data[0]?.Position ?? null,
          SpotID: responseData?.data[0]?.ActivityID ?? null,
          SpotName: responseData?.data[0]?.ActivityName ?? null,
          SrcUpdateTime: responseData?.data[0]?.SrcUpdateTime ?? null,
          UpdateTime: responseData?.data[0]?.UpdateTime ?? null,
        };
      } else {
        // handle error (後端錯誤) -> not found page(404 page)
        return {
          notFound: true,
        };
      }
      break;
    }

    // --------------------------------------------------------
    // error -> not found page(404 page)
    default:
      return {
        notFound: true,
      };
  }

  const returnData = {
    props: {
      ...(await serverSideTranslations(locale, [
        'api_mapping',
        'common',
        'detail',
      ])),
      // Will be passed to the page component as props

      data: {
        detailData,
      },
    },
  };

  return returnData;
}
