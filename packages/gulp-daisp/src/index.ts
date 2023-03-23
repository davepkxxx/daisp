import { compile } from "@daisp/compile";
import PluginError from "plugin-error";
import { Transform } from "stream";
import type Vinyl from "vinyl";

export default function (): NodeJS.ReadWriteStream {
  return new Transform({
    objectMode: true,
    transform: (chunk: Vinyl, encoding, callback) => {
      if (chunk.isNull()) {
        callback(null, chunk);
      } else if (chunk.isStream()) {
        callback(new PluginError("gulp-daisp", "Streaming not supported"));
      } else {
        if (chunk.contents) {
          chunk.contents = Buffer.from(compile(chunk.contents.toString()).code);
        }
        callback(null, chunk);
      }
    },
  });
}
