import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

interface AboutBio {
  [index: number]: string;
}

interface Assets {
  companyName: string;
  currencyCode: string;
  exchange: string;
  exchangeRate: number;
  interactive: boolean;
  numberOfShares: number;
  sharePrice: number;
  ticker: string;
}

interface DetailResponse {
  id: string;
  city: string;
  name: string;
  netWorth: number;
  position: number;
  squareImage: string;
  industries: string;
  country: string;
  financialAssets: Assets[];
  about: AboutBio[];
  bio: AboutBio[];
}

interface DetailProps {
  data: DetailResponse;
}

const Detail = ({ data }: DetailProps) => {
  const [detailData, setdetailData] = useState<DetailResponse>(data);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `https://billions-api.nomadcoders.workers.dev/person/${router.query.id}`
      );
      const jsonData = await res.json();
      setdetailData(jsonData);
    };
    fetchData();
  }, [router.query.id]);
  const formatNumber = (number: number) => {
    const million = 1000;
    if (number >= million) {
      const formattedNumber = Math.floor(number / million);
      return `${formattedNumber} Billion`;
    }
    return number.toString();
  };
  function formatNumberThousands(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  console.log(detailData && detailData);
  return (
    <div className="bg-gray-700 h-full w-auto flex flex-col justify-center items-center">
      <div className="bg-gray-800 w-2/3 m-5 flex justify-center">
        <div className="ml-8 mt-20 mb-10 mr-8">
          <img src={detailData?.squareImage} />
          <div className="flex flex-col w-auto text-white mt-2 ">
            <span className="mb-5 text-3xl font-semibold">
              {detailData.name}
            </span>
            <div className="flex flex-col leading-[10] mb-3">
              <span>NetWorth: ${formatNumber(detailData.netWorth)}</span>
              <span>Country: {detailData.country}</span>
              <span>Industry: {detailData.industries}</span>
            </div>

            <span>{detailData.bio}</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 w-2/3 m-5 ">
        <div className="ml-8 mt-20 mb-10 mr-8">
          <div className="flex flex-col w-auto text-gray-100 mt-2 ">
            <span className="mb-5 text-3xl font-semibold">
              Financil Assests
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5 leading-[10] mb-3 ">
              {detailData.financialAssets.map((item, index) => (
                <div className="text-sm flex flex-col items-start" key={index}>
                  <div className="border border-solid bg-gray-900 border-gray-500 text-green-300 w-[300px] h-[150px] pt-2 pb-4 pr-5 pl-2 flex flex-col rounded-xl">
                    <span>Company: {item.companyName}</span>
                    <span>Ticker: {item.ticker}</span>
                    <span>
                      Shares: {formatNumberThousands(item.numberOfShares)}
                    </span>
                    <span>Current Price: ${item.sharePrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<DetailProps> = async ({
  params
}) => {
  const id = params?.id;

  if (id) {
    const res = await fetch(
      `https://billions-api.nomadcoders.workers.dev/person/${id}`
    );
    const data = await res.json();

    return {
      props: {
        data
      }
    };
  }
};

export default Detail;
