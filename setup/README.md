# Cloud 9

[Cloud 9](https://c9.io/) is an online integrated development environment with an Ubuntu workspace. It offers the ability to quickly get started with a free, public, and shareable workspace.
The following steps will ensure that your Cloud 9 environment is set properly for this workshop.

1. Create a new workspace
    - Add a workspace name, ex. workshop
    - For the *Clone from Git* field, add https://github.com/pattisdr/demo-ember-osf.git
    - Choose a template: Blank
    - Click `Create workspace`
1. (In the terminal) Run `git checkout workshop_demo`
1. Run `. ./setup/cloud9.sh`.  Copy this exactly, the `. ./` is important.
1. Toolbar → Run → Run Configurations → New Run Configuration
  1. Give it a name, in the first gray box. (e.g. `serve`)
  1. Command: `ember server`
  1. Click ENV
    - BACKEND test
    - PORT 8080
1. Go to http://[workspace-name]-[username].c9users.io/

## Notes
* The Cloud 9 environment does not support docker at this time.
* The setup script sets the default port to 8080, which is necessary to proxy requests to the ember development server.
