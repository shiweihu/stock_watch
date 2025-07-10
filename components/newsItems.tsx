import { NewsItem } from "@/di/mode";
import { Box, CardActions, CircularProgress, IconButton, Typography } from "@mui/material";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TranslateIcon from '@mui/icons-material/Translate';
import { useEffect, useState } from "react";


export default function NewsItems({ newsItems, translateCallBack }: { newsItems: NewsItem, translateCallBack: (item: NewsItem) => void }) {

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(false)
    }, [newsItems.translated])


    return (
        <Card sx={{
            width: {
                xs: '95%',  // 手机屏幕
                sm: '95%',   // 小平板（可选）
                md: '90%',   // 中等屏幕（可选）
                lg: 345,   // 大屏幕 / 桌面
            }, margin: '0 auto', boxShadow: 3, borderRadius: 2, backgroundColor: 'background.paper'
        }} elevation={5} >
            <CardHeader
                title={newsItems.headline}
                subheader={`${newsItems.related !== '' ? `Related: ${newsItems.related} ` : ""}Souce:${newsItems.source}`}
            />
            {newsItems.image
                ? (
                    <CardMedia
                        component="img"
                        image={newsItems.image}
                        alt="news image"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'contain', // 保持比例，不裁剪
                        }}

                    />
                ) : (
                    <Box height={0} />
                )}

            <CardContent>
                <Typography variant='body1' sx={{ color: 'text.primary' }}>
                    {newsItems.summary}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {new Date(newsItems.datetime * 1000).toISOString().split('T')[0]}
                </Typography>

            </CardContent>

            <CardActions disableSpacing sx={{ justifyContent: 'flex-end' }}>
                {isLoading && <CircularProgress size={25} />}
                {(!isLoading && (!newsItems.translated || newsItems.translated === undefined)) && <IconButton
                    aria-label="translate"
                    onClick={() => {
                        translateCallBack(newsItems)
                        setIsLoading(true)
                    }}
                ><TranslateIcon />
                </IconButton>}
                <IconButton
                    component="a"
                    href={newsItems.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="visit this news"
                >
                    <OpenInNewIcon />
                </IconButton>
            </CardActions>

        </Card>
    );
}