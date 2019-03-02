(function () {
  'use strict';

  let nextRefnum = 1;
  class RefnumManager {
      constructor () {
          this.refnums = new Map();
      }

      createRefnum (obj) {
          const refnum = nextRefnum;
          nextRefnum += 1;
          this.refnums.set(refnum, obj);
          return refnum;
      }

      getObject (refnum) {
          return this.refnums.get(refnum);
      }

      closeRefnum (refnum) {
          this.refnums.delete(refnum);
      }
  }

  const refnumManager = new RefnumManager();

  const createCompiler = function () {
    return new Promise (function (resolve) {
      const clang = new ProcessManager('clang', 'clang');
      clang.print = ({text}) => console.log(text); 
      clang.printErr = ({text}) => console.error(text);

      const originalWorkerReady = clang.workerReady;
      clang.workerReady = (...args) => {
        originalWorkerReady.apply(clang, args);
        clang.workerReady = originalWorkerReady;

        const refnum = refnumManager.createRefnum(clang)
        resolve(refnum);
      };

      clang.start();
    });
  };

  const executeCompiler = function (refnum, source) {
    return new Promise(function (resolve, reject) {
        const clang = refnumManager.getObject(refnum);

        clang.workerCompileDone = function (args) {
          if (args.result) {
            console.log('wasm size: ' + args.result.length + '\n');
            resolve(args.result);
          } else {
            reject(new Error('Compile failed'));
          }
        };

        clang.worker.postMessage({
            function: 'compile',
            code: source,
        });
    });
  };

  const createRuntime = function () {
    return new Promise(function (resolve) {

      const runtime = new ProcessManager('runtime', 'runtime');
      runtime.print = ({text}) => console.log(text); 
      runtime.printErr = ({text}) => console.error(text);

      const originalWorkerReady = runtime.workerReady;
      runtime.workerReady = (...args) => {
        originalWorkerReady.apply(runtime, args);
        runtime.workerReady = originalWorkerReady;

        const refnum = refnumManager.createRefnum(runtime)
        resolve(refnum);
      };

      runtime.start();
    });
  };

  const executeRuntime = function (refnum, wasm) {
    return new Promise(function (resolve) {
      const runtime = refnumManager.getObject(refnum);

      runtime.workerRunDone = args => {
          resolve();
      };

      runtime.worker.postMessage({
        function: 'run',
        wasmBinary: wasm,
      });
    });
  };

  const getSavedResult = function (refnum, name) {
    return new Promise(function (resolve) {
      const runtime = refnumManager.getObject(refnum);

      runtime.workerGetSavedResultDone = args => {
        resolve(args.result);
      };

      runtime.worker.postMessage({
        function: 'getSavedResult',
        name
      })
    });
  };

  window.cib_wrapper = {
    createCompiler,
    executeCompiler,
    createRuntime,
    executeRuntime,
    getSavedResult
  };
}());
