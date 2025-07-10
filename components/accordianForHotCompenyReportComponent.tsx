import { HotCompanyReport } from "@/di/mode";
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TradingViewWidget from "./tradingViewComponent";
import { useState } from "react";



export function AccordianForHotCompenyReportComponent({report,index}:{report:HotCompanyReport, index:number}){

    const [expanded, setExpanded] = useState<boolean>(index === 0);

    const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded);
    };

    return(
        <Accordion expanded={expanded} onChange={handleChange} >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    
                    >
                         <Box display="flex" justifyContent="space-between" width="100%">
                            <Typography component="span">{report.symbol}</Typography>
                            <Typography component="span">{report.score}</Typography>
                            <Typography component="span">{report.date}</Typography>
                         </Box>
                    
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box display="flex" flexDirection='column' gap={2} width="100%">
                            <Box
                            dangerouslySetInnerHTML={{ __html: report.report }} 
                            sx={{
                                lineHeight: 1.8,
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                '& ul': {
                                    marginLeft:{
                                        xs: 0,       // 移动端不缩进
                                        sm: 1,     // 小平板缩进
                                        md: 2,     // 中等屏幕缩进
                                        lg: 2,     // 大屏幕缩进
                                    },
                                    paddingLeft: {
                                        xs: 0,       // 移动端不缩进
                                        sm: 0,     // 小平板缩进
                                        md: 0,     // 中等屏幕缩进
                                        lg: 0,     // 大屏幕缩进
                                    },
                                },
                                '& li': {
                                    marginLeft:{
                                        xs: 0,       // 移动端不缩进
                                        sm: 1,     // 小平板缩进
                                        md: 2,     // 中等屏幕缩进
                                        lg: 2,     // 大屏幕缩进
                                    },
                                    paddingLeft: {
                                        xs: 0,       // 移动端不缩进
                                        sm: 0,     // 小平板缩进
                                        md: 0,     // 中等屏幕缩进
                                        lg: 0,     // 大屏幕缩进
                                    },
                                },
                                '& a': {
                                color: 'primary.main',
                                textDecoration: 'underline',
                                },
                                '& code': {
                                fontFamily: 'monospace',
                                backgroundColor: '#f5f5f5',
                                px: 0.5,
                                borderRadius: 1,
                                },
                                '& pre': {
                                overflowX: 'auto',
                                backgroundColor: '#f0f0f0',
                                p: 2,
                                borderRadius: 1,
                                wordBreak: 'break-word',
                                whiteSpace: 'pre-wrap'
                                },
                            }}/>
                            
                            {expanded && <TradingViewWidget symbol={report.symbol} />}
                        </Box>
                        
                    </AccordionDetails>
                </Accordion>
    )
}