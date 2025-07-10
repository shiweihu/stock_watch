'use client'

import { NewsItem } from "@/di/mode";
import { TextField } from "@mui/material";
import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';
import NewsItems from "./newsItems";
import { useState } from "react";


export default function CompanyNewsComponent({ newsList, query, queryCallBack, translateCallBack }: { newsList: NewsItem[], query: string, queryCallBack: (query: string) => void, translateCallBack: (item: NewsItem) => void }) {

    const [searchQuery, setSearchQuery] = useState(query)

    return (
        <Box width='100%' sx={{ flexGrow: 1 }} display='flex' flexDirection='column' justifyContent='center' alignItems='center' padding={5}>
            <TextField
                id="search"
                label="Search"
                type="search"
                variant="outlined"
                value={searchQuery}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchQuery(event.target.value);
                }}
                sx={{ width: { xs: '100%', sm: '400px' } }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        queryCallBack(searchQuery)
                    }
                }}
            />
            <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={5} sx={{
                width: {
                    xs: '95%',  // 手机屏幕
                    sm: '90%',  // 小平板（可选）
                    md: '85%',  // 中等屏幕（可选）
                    lg: '80%',  // 大屏幕 / 桌面
                }, margin: '0 auto'
            }} >
                {newsList.map((item, index) => (
                    <NewsItems key={index} newsItems={item} translateCallBack={translateCallBack} />
                ))}
            </Masonry>

        </Box>
    );
}