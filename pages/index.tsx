import { useState, useEffect } from "react";
import Link from "next/link";

interface billionares {
  id: string;
  industries: [];
  name: string;
  squareImage: string;
  netWorth: number;
}

export default function IndexPage() {
  const [data, setData] = useState<billionares[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://billions-api.nomadcoders.workers.dev/");
      const jsonData = await res.json();
      const slicedData = jsonData.slice(0, 20);
      setData(slicedData);
    };
    fetchData();
  }, []);
  const formatNumber = (number: number) => {
    const million = 1000;
    if (number >= million) {
      const formattedNumber = Math.floor(number / million);
      return `${formattedNumber} Billion`;
    }
    return number.toString();
  };
  console.log(data);
  return (
    <div className="flex justify-around bg-gray-300">
      <div className="grid grid-cols-4 gap-6 m-4">
        {data &&
          data.map(item => (
            <div className="text-sm" key={item.id}>
              <Link href={`/person/${item.id}`}>
                <a>
                  <img
                    className="rounded-md border border-solid border-gray-300"
                    src={item.squareImage}
                  />
                  <span className="text-sm font-semibold">{item.name}</span>
                  <div className="text-xs">
                    <span>{formatNumber(item.netWorth)}</span>
                    <span> / {item.industries}</span>
                  </div>
                </a>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
