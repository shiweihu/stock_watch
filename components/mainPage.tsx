'use client'


import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import { Button } from "@mui/material";
import { NewsItem } from "@/di/mode";
// Define HotCompanyReport type if not already imported
import { HotCompanyReport } from "@/di/mode";
import { useEffect, useRef, useState } from "react";
import MarketNewsComponent from "./marketNewsComponent";
import CompanyNewsComponent from "./companyNewsComponent";
import { getCompanyData, getHotCompanyAnalysisReports, getMarketData } from "@/di/serveAPI";
import { Box, Fab } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics'
import AnalysisReport from "./reportDialog";
import { HotCompanyReportComponent } from "./hotCompanyReportComponent";
import { renderMarkdown } from '@/app/lib/markdown';




export default function MainPage({ marketNewsList }: { marketNewsList: NewsItem[] }) {

    const [pageIndex, setPageIndex] = useState(0)
    const [query, setQuery] = useState("")
    const isFirstRender = useRef(true);
    const [analysisText, setAnalysisText] = useState("")
    const [newsList, setNewList] = useState<NewsItem[]>(marketNewsList)
    const [openDialog, setOpenDialog] = useState(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const [hotCompanyReport, setHotCompanyReport] = useState<Array<HotCompanyReport>>([])

    const onPageChange = (index: number) => {
        setPageIndex(index)
        setNewList([])
    }

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; // 下次开始允许执行
            return;
        }
        if (pageIndex === 0) {
            const fetchMarketNews = async () => {
                const data = await getMarketData()
                setNewList(data)
            }
            fetchMarketNews()
        } else if (pageIndex === 1) {
            const fetchCompanyNews = async () => {
                const data = await getCompanyData(query)
                setNewList(data)
            }
            if (query !== "") fetchCompanyNews()
        } else if (pageIndex === 2) {
            const fetchHotCompanyNews = async () => {
                setHotCompanyReport([])
                const data = await getHotCompanyAnalysisReports() as Array<HotCompanyReport>
                const markdownList = data.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    if (+dateA !== +dateB) {
                        return dateB.getTime() - dateA.getTime(); // 降序排列
                    } else {
                        return a.symbol.localeCompare(b.symbol) // 如果日期相同，按symbol升序排列
                    }

                }).map(async (item) => {
                    return {
                        ...item,
                        report: await renderMarkdown(item.report)
                    }
                })
                setHotCompanyReport(await Promise.all(markdownList))
            }
            fetchHotCompanyNews()
        }
    }, [pageIndex, query])

    // useEffect(()=>{
    //     if(query !== ""){
    //         setNewList([])
    //         const fetchCompanyNews = async() =>{
    //             const data = await getCompanyData(query)
    //             setNewList(data)
    //         }
    //         fetchCompanyNews()
    //     }
    // },[query])

    const getTranslateContent = async (item: NewsItem) => {


        const response = await fetch('/api/gemini/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });
        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const newItem = await response.json() as NewsItem
        const newList = newsList.map((value) => {
            if (value.id === newItem.id && value.datetime === newItem.datetime && value.url === newItem.url) {
                value.summary = newItem.summary
                value.headline = newItem.headline
                value.translated = true
            }
            return value
        })
        setNewList(newList)

    }

    const getStockAnalysis = async () => {

        interface ReportContents {
            headline: string
            date: string
            summary: string
            url: string
        }
        const reportData = Array<ReportContents>()
        newsList.forEach((value) => {
            reportData.push({
                headline: value.headline,
                date: new Date(value.datetime).toDateString(),
                summary: value.summary,
                url: value.url
            })
        })
        setAnalysisText("")
        setOpenDialog(true)
        abortController?.abort()
        const controller = new AbortController();
        setAbortController(controller);

        const response = await fetch('/api/gemini/analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reportData), // 👈 传递数组（直接 json[]）
            signal: controller.signal
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder('utf-8');

        try {
            while (true && reader !== undefined) {
                const { done, value } = await reader.read();
                if (done) {
                    break
                }
                const chunk = decoder.decode(value);
                setAnalysisText((prev) => prev + chunk)
                await new Promise((resolve) => setTimeout(resolve, 300));

                // 可选：分段更新 UI
                console.log('分段:', chunk);
            }
        } catch (error) {
            console.log('Fetch aborted:', error);
        }
    }



    return (
        <Box  >
            {openDialog && <AnalysisReport information={analysisText} open={openDialog} handleClose={() => {
                //abortController?.abort({ reason: 'Dialog closed' })
                if (!abortController?.signal.aborted) {
                    abortController?.abort({ reason: 'Dialog closed' });
                }
                setAbortController(null)
                setOpenDialog(false)
                console.log("Dialog closed, aborting fetch request.")
            }} />}
            <AppBar position='sticky'>
                <Toolbar variant='regular'>
                    <Button variant="text" color="inherit" onClick={() => onPageChange(0)}>Market News</Button>
                    <Button variant="text" color="inherit" onClick={() => onPageChange(1)}>Company News</Button>
                    <Button variant="text" color="inherit" onClick={() => onPageChange(2)}>Hot Company News</Button>
                </Toolbar>
            </AppBar>
            <Fab disabled={pageIndex === 2} color="primary" aria-label="add" sx={{
                position: 'fixed',
                top: 80,
                right: 32,
                zIndex: 1, // 确保不被遮盖
            }} onClick={getStockAnalysis}
            >
                <AnalyticsIcon />
            </Fab>
            <Box>
                {pageIndex === 0 && <MarketNewsComponent newsList={newsList} translateCallBack={(item: NewsItem) => {
                    getTranslateContent(item)
                }} />}
                {pageIndex === 1 && <CompanyNewsComponent newsList={newsList} query={query} queryCallBack={(query: string) => {
                    setQuery(query)
                }} translateCallBack={(item: NewsItem) => {
                    getTranslateContent(item)
                }} />}
                {pageIndex === 2 && <HotCompanyReportComponent hotCompanyReport={hotCompanyReport} />}

            </Box>
        </Box>
    );
}