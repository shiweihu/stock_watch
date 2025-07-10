export interface NewsItem {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
  translated : boolean
}

export interface HotCompanyReport{
    symbol:string
    report:string
    date:string
    score:string
}