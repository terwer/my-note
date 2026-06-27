#!/bin/sh
set -e

# Default values
PUID=${PUID:-1000}
PGID=${PGID:-1000}
USER_NAME=${USER_NAME:-mynote}
GROUP_NAME=${GROUP_NAME:-mynote}
WORKSPACE_DIR="/my-note/workspace"

# Get or create group
group_name="${GROUP_NAME}"
if getent group "${PGID}" > /dev/null 2>&1; then
    group_name=$(getent group "${PGID}" | cut -d: -f1)
    echo "Using existing group: ${group_name} (${PGID})"
else
    echo "Creating group ${group_name} (${PGID})"
    addgroup --gid "${PGID}" "${group_name}"
fi

# Get or create user
user_name="${USER_NAME}"
if getent passwd "${PUID}" > /dev/null 2>&1; then
    user_name=$(getent passwd "${PUID}" | cut -d: -f1)
    echo "Using existing user ${user_name} (PUID: ${PUID}, PGID: ${PGID})"
else
    echo "Creating user ${user_name} (PUID: ${PUID}, PGID: ${PGID})"
    adduser --uid "${PUID}" --ingroup "${group_name}" --disabled-password --gecos "" "${user_name}"
fi

# Parse command line arguments for --workspace option or SIYUAN_WORKSPACE_PATH env variable
# Store other arguments in ARGS for later use
if [[ -n "${MYNOTE_WORKSPACE_PATH}" ]]; then
    WORKSPACE_DIR="${MYNOTE_WORKSPACE_PATH}"
fi
ARGS=""
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --workspace=*) WORKSPACE_DIR="${1#*=}"; shift ;;
        *) ARGS="$ARGS $1"; shift ;;
    esac
done

# Change ownership of relevant directories, including the workspace directory
echo "Adjusting ownership of /opt/my-note, /home/my-note/, and ${WORKSPACE_DIR}"
chown -R "${PUID}:${PGID}" /opt/my-note
chown -R "${PUID}:${PGID}" /home/my-note/
chown -R "${PUID}:${PGID}" "${WORKSPACE_DIR}"

# Switch to the newly created user and start the main process with all arguments
echo "Starting MyNote with UID:${PUID} and GID:${PGID} in workspace ${WORKSPACE_DIR}"
exec su-exec "${PUID}:${PGID}" /opt/my-note/kernel --workspace="${WORKSPACE_DIR}" ${ARGS}
