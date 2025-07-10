'use client'
import { NewsItem } from "@/di/mode";
import Masonry from '@mui/lab/Masonry';
import { Box, Skeleton } from '@mui/material';
import NewsItems from "./newsItems";

export default function MarketNewsComponent({ newsList, translateCallBack }: { newsList: NewsItem[], translateCallBack: (item: NewsItem) => void }) {




    return (
        <Box width='100%' padding={5}>
            <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={5} sx={{
                width: {
                    xs: '95%',  // 手机屏幕
                    sm: '90%',  // 小平板（可选）
                    md: '85%',  // 中等屏幕（可选）
                    lg: '80%',  // 大屏幕 / 桌面
                }, margin: '0 auto'
            }} >

                {newsList.length === 0 && Array.from({ length: 20 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        variant="rounded"
                        sx={{
                            width: { xs: '100%', sm: '95%', md: '90%', lg: 345 }
                        }}
                        height={500}
                    />
                ))}
                {newsList.length !== 0 && newsList.map((item, index) => (
                    <NewsItems key={index} newsItems={item} translateCallBack={translateCallBack} />
                ))}
            </Masonry>
        </Box>
    );


}