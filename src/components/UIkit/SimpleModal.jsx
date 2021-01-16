import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    padding: 30,
    textAlign: 'center',
    color:'#ddd',
    fontWeight:'bold',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid yellow',
    borderRadius: 5,
    // boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
}));

const SimpleModal = (props) => {
  const classes = useStyles();

  const handleClose = () => {
    props.setOpen(false);
  };

  const body = (
    <div className={classes.paper}>
      <p style={{fontSize: '24px'}}>
        {props.text}
      </p>
    </div>
  );

  return (
    <div>
      <Modal
        open={props.open}
        onClose={handleClose}
      >
        {body}
      </Modal>
    </div>
  );
}

export default SimpleModal;
