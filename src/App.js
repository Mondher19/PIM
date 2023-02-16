import React, { useState, useEffect } from "react";
import { Octokit } from "@octokit/core";
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const octokit = new Octokit({
  auth: "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",
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  list: {
    maxHeight: 300,
    overflow: 'auto',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    minWidth: 300,
  },
  closeButton: {
    marginTop: theme.spacing(2),
  },
}));

function App() {
  const classes = useStyles();
  const [repos, setRepos] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [open, setOpen] = useState(false);

  // Fetch repositories from GitHub API
  useEffect(() => {
    async function fetchRepos() {
      try {
        const { data } = await octokit.request("GET /user/repos", {});
        setRepos(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchRepos();
  }, []);

  // Fetch branches when a repository is selected
  useEffect(() => {
    async function fetchBranches() {
      if (selectedRepo) {
        try {
          const { data } = await octokit.request(
            `GET /repos/${selectedRepo}/branches`,
            {}
          );
          setBranches(data);
          setOpen(true);
        } catch (error) {
          console.error(error);
        }
      } else {
        setBranches([]);
        setOpen(false);
      }
    }
    fetchBranches();
  }, [selectedRepo]);

  function handleClose() {
    setOpen(false);
  }

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h3">My Repositories and Branches</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Typography variant="h5">Repositories</Typography>
            <List component="nav">
              {repos.map((repo) => (
                <ListItem button key={repo.id} onClick={() => setSelectedRepo(repo.full_name)}>
                <ListItemText primary={repo.full_name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Typography variant="h5">Branches</Typography>
            <List className={classes.list} component="nav">
              {branches.map((branch) => (
                <ListItem key={branch.name}>
                  <ListItemText primary={branch.name} />
                </ListItem>
              ))}
            </List>
            <Modal
              className={classes.modal}
              open={open}
              onClose={handleClose}
            >
              <div className={classes.modalContent}>
                <Typography variant="h5">
                  Branches for {selectedRepo}
                </Typography>
                <List className={classes.list} component="nav">
                  {branches.map((branch) => (
                    <ListItem key={branch.name}>
                      <ListItemText primary={branch.name} />
                    </ListItem>
                  ))}
                </List>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.closeButton}
                  onClick={handleClose}
                >
                  Close
                </Button>
              </div>
            </Modal>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
export default App;