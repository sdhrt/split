"use client";
import { toast } from "@/hooks/use-toast";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

function Chart({ userHistory }: { userHistory: any }) {
  const [pieData, setPieData] = useState([]);
  useEffect(() => {
    (async () => {
      const history = JSON.parse(userHistory);
      const data = history.flatMap(async (item: any) => {
        const ids = item.history.map((h: any) => h.user);
        const labels = await Promise.all(ids.map((id: string) => getEmail(id)));
        const amount = item.amount;
        const split = item.history.map((h: any) => (h.split / 100) * amount);
        const d = {
          labels: labels,
          createdAt: item.createdAt,
          datasets: [
            {
              label: "Split",
              data: split,
              backgroundColor: [
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
              ],
              borderColor: [
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
              ],
              borderWidth: 1,
            },
          ],
        };
        return d;
      });
      // @ts-ignore
      setPieData(await Promise.all(data));
    })();

    async function getEmail(userid: string) {
      const res = await fetch("/api/get-email", {
        method: "POST",
        body: JSON.stringify({ userid: userid }),
      });
      const { email } = await res.json();
      if (!email) {
        toast({
          title: "Server Error",
        });
        return null;
      }
      return email;
    }
  }, [userHistory]);
  return (
    <div className="grid grid-cols-2 gap-4 px-10">
      {pieData.map((pieD: any, i) => {
        const amount = pieD.datasets.reduce((_: number, p: any) => {
          return p.data.reduce((t: number, p: number) => t + p, 0);
        }, 0);
        return (
          <div
            key={i}
            className="flex flex-col items-center border border-gray-300 p-4 rounded-md"
          >
            <span className="text-xl font-semibold">Splitting {amount}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(pieD.createdAt).toLocaleTimeString()}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(pieD.createdAt).toLocaleDateString()}
            </span>
            <div className="relative w-[20vw]">
              <Pie data={pieD} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Chart;
