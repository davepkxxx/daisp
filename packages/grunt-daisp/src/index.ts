import { compile } from "@daisp/compile";
import { basename, extname, resolve } from "path";

export default function ({ file, log, task }: IGrunt) {
  task.registerMultiTask(
    "daisp",
    "Compile Daisp files into JavaScript",
    function () {
      this.files.forEach(({ src, dest }) => {
        (src || [])
          .filter((filepath) => {
            if (!file.exists(filepath)) {
              log.warn(`Source file '${filepath}' not found.`);
              return false;
            }

            return true;
          })
          .forEach((filepath) => {
            if (dest) {
              const target = resolve(
                dest,
                basename(filepath, extname(filepath)) + ".js"
              );
              const { code } = compile(file.read(filepath));
              file.write(target, code);
              log.writeln(`File '${target}' created.`);
            }
          });
      });
    }
  );
}
