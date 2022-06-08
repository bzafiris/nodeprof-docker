FROM ubuntu:20.04 as nodeprof-builder

RUN \
  apt-get update && \
  apt-get -y upgrade && \
  apt-get install -y build-essential git wget python3 python3-pip && pip3 install ninja_syntax

RUN git clone https://github.com/graalvm/mx.git

ENV PATH ${PATH}:/mx

RUN mx fetch-jdk --java-distribution labsjdk-ce-11

ENV JAVA_HOME /root/.mx/jdks/labsjdk-ce-11-jvmci-22.2-b02

WORKDIR /workspace-nodeprof
RUN git clone https://github.com/Haiyang-Sun/nodeprof.js.git

WORKDIR /workspace-nodeprof/nodeprof.js

RUN mx sforceimports

RUN mx build

VOLUME [ "/data" ]

ADD sample /workspace-nodeprof/sample

# Warm up for future runs (installs nodejs app)
RUN mx jalangi "--analysis" /workspace-nodeprof/sample/analysis.js /workspace-nodeprof/sample/program.js

