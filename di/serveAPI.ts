'use server'

import { NewsItem } from "./mode";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_cache } from 'next/cache';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const getHotCompanyAnalysisReports = unstable_cache(async () => {
  const command = new ScanCommand({ TableName: "stock_report" });
  const result = await docClient.send(command);
  return result.Items
}, ['hotCompanyAnalysisReports'], {
  tags: ['hotCompanyAnalysisReports'],
  revalidate: 60, // 每隔60秒重新拉取一次数据
})

// export async function getHotCompanyAnalysisReports(){

//       const command = new ScanCommand({ TableName: "stock_report" });
//       const result = await docClient.send(command);
//       return result.Items
// }


export async function getMarketData() {
  const baseUrl = 'https://finnhub.io/api/v1/news';
  const params = new URLSearchParams({
    category: 'general',
    token: 'd0hfq7hr01qv1u377negd0hfq7hr01qv1u377nf0',
  });

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    next: { revalidate: 60 }, // 每隔60秒重新拉取一次数据
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return (await response.json() as Array<NewsItem>).sort((a: NewsItem, b: NewsItem) => b.datetime - a.datetime);
}

export async function getCompanyData(company: string) {

  function formatDate(date: Date) {
    return date.toISOString().split('T')[0]; // 获取 YYYY-MM-DD
  }

  // 获取今天
  const today = new Date();
  const todayStr = formatDate(today);

  // 获取七天前
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 3);
  const sevenDaysAgoStr = formatDate(sevenDaysAgo);


  const baseUrl = 'https://finnhub.io/api/v1/company-news';
  const params = new URLSearchParams({
    symbol: company.trim(),
    token: 'd0hfq7hr01qv1u377negd0hfq7hr01qv1u377nf0',
    from: sevenDaysAgoStr,
    to: todayStr
  });

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    next: { revalidate: 60 }, // 每隔60秒重新拉取一次数据
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return (await response.json() as Array<NewsItem>).sort((a: NewsItem, b: NewsItem) => b.datetime - a.datetime);
}





