FROM node:21

ARG USERNAME=dev
ARG USER_UID=1001
ARG USER_GID=$USER_UID

RUN apt-get update && apt-get install -y zsh sudo

RUN groupadd --gid $USER_GID $USERNAME
RUN useradd --uid $USER_UID --gid $USER_GID -ms /bin/zsh $USERNAME
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME
RUN chmod 0440 /etc/sudoers.d/$USERNAME

USER $USERNAME
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" && \
    sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="jonathan"/' ~/.zshrc && \
    rm -Rf install.sh
CMD [ "sleep", "infinity" ]
 