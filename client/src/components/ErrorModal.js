import { useContext } from 'react';
import AuthContext from '../auth';
import Button from '@mui/material/Button';
import Modal  from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

export default function ErrorModal() {
    const { auth } = useContext(AuthContext);
    let open = false;
    
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };

  if(auth.errorMessage)
  {
    open = true;
  }

  function close(){
      open = false;
      auth.eraseError();
  }

return(
    <Modal
    open={open}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
          <Box style = {style}>
            <Button style={{backgroundColor:"black", width:"100%"}} onClick = {close}>close</Button>
           <Alert severity = 'warning'>  {auth.errorMessage} </Alert>        
          </Box>
  </Modal>
  );
}