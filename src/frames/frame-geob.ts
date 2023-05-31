import { FrameBuilder } from "../FrameBuilder"
import { FrameReader } from "../FrameReader"
import { GeneralObject } from "../types/TagFrames"

const formatText = (text: string, size: number) => {
    return text.padEnd(size, ' ').substr(0,size)
}

export const GEOB  = {
    create: (geob: GeneralObject): Buffer => {
        return new FrameBuilder("GEOB")
            .appendTerminatedText(formatText(geob.mimeType ?? "", 24))
            .appendTerminatedText(formatText(geob.ownerIdentifier ?? "", 18))
            .appendBuffer(geob.data)
            .getBufferWithPartialHeader()
    },
    read: (buffer: Buffer): GeneralObject => {
        const reader = new FrameReader(buffer, {consumeEncodingByte: true})
        return {
            mimeType: reader.consumeText({size: 24}),
            ownerIdentifier: reader.consumeText({size: 18}),
            data: reader.consumePossiblyEmptyBuffer()
        }
    }
}
