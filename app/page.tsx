import MainPage from "@/components/mainPage";
import { getMarketData } from "@/di/serveAPI";




export default async function Home() {

  const marketNewsList = await getMarketData()
  return (
    <MainPage marketNewsList={marketNewsList}></MainPage>
  );
}
