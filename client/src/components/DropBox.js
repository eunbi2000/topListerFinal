import { useContext } from 'react'
import Top5Item from './Top5Item.js'
import List from '@mui/material/List';
import { Typography } from '@mui/material'
import { GlobalStoreContext } from '../store/index.js'
import { Box } from '@mui/system';
import ListBox from './ListBox.js';
import CommentBox from './CommentBox.js';
import AuthContext from '../auth';

function DropBox(props) {

    const style = {
        marginTop: "30px",
        width: "100%",
        height:"300px",
        backgroundColor: "gray",
        borderRadius: 20
    };

    const style2 = {
        marginTop: "30px",
        width: "100%",
        height:"300px",
        backgroundColor: "beige",
        borderRadius: 20
    };

    return(< Box style = {props.idNamePair.published?style:style2} justifyContent = "space-around" flexDirection = "row" sx = {{display:"flex"}}>
        <ListBox
            idNamePair = {props.idNamePair}
        />
        <CommentBox
            idNamePair = {props.idNamePair}
        />
    </Box>)
}

export default DropBox; 