

import { HotCompanyReport } from "@/di/mode";
import { Box, Container, Skeleton } from "@mui/material";
import { AccordianForHotCompenyReportComponent } from "./accordianForHotCompenyReportComponent";


export function HotCompanyReportComponent({hotCompanyReport}:{hotCompanyReport:Array<HotCompanyReport>}){
    return (
        <Container  maxWidth="lg">
            <Box width='100%' sx={{ flexGrow: 1 }} display='flex' flexDirection='column' justifyContent='center' alignItems='center' padding={5}>
                 {hotCompanyReport.length === 0 && Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton
                    key={index}
                    variant="rounded"
                    width="100%"
                    height={index===0 ? 500:50}
                    sx={{margin:2}}
                    />
                ))}
                {hotCompanyReport.map((item,index)=>(
                    <Box paddingY={1} width='100%' key={index}>
                        <AccordianForHotCompenyReportComponent  index={index} report={item} />
                    </Box>
                ))}
            </Box>
        </Container>
        
    )
}   