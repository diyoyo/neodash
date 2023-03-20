import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import NeoWorkflowEditorModal from './WorkflowEditorModal';
import { Button } from '@material-ui/core';
import { PlayArrow } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
const styles = {};

// Temporary list of hardcoded workflows
const workflows = [
  {
    name: 'My Workflow',
    steps: [
      {
        key: 'pageRank',
        name: 'PageRank',
        query: 'RETURN false',
        description: '...',
      },
    ],
  },
  {
    name: 'My Workflow #2',
    steps: [],
  },
];

export const NeoWorkflowListModal = ({ open, setOpen }) => {
  const columns = [
    { field: 'id', hide: true, headerName: 'ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 310 },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: () => {
        return (
          <div>
            <IconButton onClick={() => {}} style={{ padding: '6px' }}>
              <Badge overlap='rectangular' badgeContent={''}>
                <PlayArrow />
              </Badge>
            </IconButton>
            <IconButton
              onClick={() => {
                setEditorOpen(true);
              }}
              style={{ padding: '6px' }}
            >
              <Badge overlap='rectangular' badgeContent={''}>
                <EditIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={() => {}} style={{ padding: '6px' }}>
              <Badge overlap='rectangular' badgeContent={''}>
                <DeleteIcon />
              </Badge>
            </IconButton>
          </div>
        );
      },
      width: 140,
    },
  ];
  const rows = Object.values(workflows).map((workflow, index) => {
    return { id: index, ...workflow };
  });

  const [editorOpen, setEditorOpen] = React.useState(false);

  return (
    <>
      <Dialog
        maxWidth={'lg'}
        open={open == true}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>
          Workflows
          <IconButton
            onClick={() => {
              setOpen(false);
            }}
            style={{ padding: '3px', float: 'right' }}
          >
            <Badge overlap='rectangular' badgeContent={''}>
              <CloseIcon />
            </Badge>
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ width: '500px' }}>
          <div style={{ height: '380px' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              getRowHeight={() => 'auto'}
              pageSize={5}
              sx={{ [`& .${gridClasses.cell}`]: { py: 1 } }}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              components={{ ColumnSortedDescendingIcon: () => <></>, ColumnSortedAscendingIcon: () => <></> }}
            />
          </div>
          <Button
            onClick={() => {
              setEditorOpen(true);
            }}
            style={{ float: 'right', backgroundColor: 'white', marginBottom: 10 }}
            variant='contained'
            size='medium'
            endIcon={<PlayArrow />}
          >
            Add Workflow
          </Button>
        </DialogContent>
      </Dialog>
      <NeoWorkflowEditorModal
        open={editorOpen}
        setOpen={setEditorOpen}
        name={undefined}
        setName={undefined}
      ></NeoWorkflowEditorModal>
    </>
  );
};
const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NeoWorkflowListModal));
