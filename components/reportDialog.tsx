'use client'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Fragment, useEffect, useRef, useState } from 'react';
import { renderMarkdown } from '@/app/lib/markdown';


type AnalysisReportProps = {
  information: string;
  open: boolean;
  handleClose: () => void;
};
export default function AnalysisReport({information,open,handleClose}:AnalysisReportProps){
        
        //const [scroll, setScroll] = useState<DialogProps['scroll']>('paper');
        const [content,setContent] = useState("")
        //const [openDialog, setOpenDialog] = useState(open);
    

        const descriptionElementRef = useRef<HTMLElement>(null);
        useEffect(() => {
            if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
            }
        }, [open]);

        useEffect(()=>{
            const preseText = async ()=> {
                const clean = await renderMarkdown(information);
                setContent(clean)
            }
            if(information !== ""){
                preseText()
            }
        },[information])

      


        return (
<Fragment>
            <Dialog
                open={open}
                onClose={()=>{
                   
                    handleClose()
                }}
                scroll='paper'
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                  slotProps={{
                    paper: {
                    sx: {
                        width: 1000,
                        height: 1000,
                        maxWidth: 'none',
                    },
                    },
                }}
                
            >
                <DialogTitle id="scroll-dialog-title">Analysis Report</DialogTitle>
                <DialogContent dividers={true}>
                <DialogContentText
                    component="div" //允许渲染 HTML
                    dangerouslySetInnerHTML={{ __html: content }}
                    sx={{
                        lineHeight: 1.8,
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
                        },
                    }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{
                        handleClose()
                    }}>OK</Button>
                </DialogActions>
            </Dialog>
            </Fragment>
        );
}


