import { useContext } from 'react';
import AuthContext from '../auth';
import Button from '@mui/material/Button';
import Modal  from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { GlobalStoreContext } from '../store'
import Alert from '@mui/material/Alert';

export default function DeleteModal() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
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

  function close(){
      open = false;
      store.unmarkListForDeletion();
  }

  function deleteList()
  {
    if(!store.listMarkedForDeletion.published){   
      store.deleteMarkedList();
    }
    else{
      store.updateCommD(store.listMarkedForDeletion);
    }
    open = false;
  }

  if(store.listMarkedForDeletion)
  {
    open = true;
  }

return(
    <Modal
    open={open}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
          <Box style = {style}>
            <Button style={{backgroundColor:"orange", width:"100%"}} onClick = {close}>close</Button>
            <Stack direction = "row" spacing={0}>
                <Button style={{backgroundColor:"white", width:"50%"}} onClick = {deleteList}>Confirm</Button>
                <Button style={{backgroundColor:"white", width:"50%"}} onClick = {close}>Cancel</Button>
            </Stack>
          </Box>
  </Modal>
  );
}