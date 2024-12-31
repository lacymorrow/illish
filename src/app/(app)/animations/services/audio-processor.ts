import ffmpeg from "fluent-ffmpeg";
import { type ProcessOptions } from "../types";

interface AudioMetadata {
    duration: number;
    format: string;
    bitrate: number;
    size: number;
    channels: number;
    sampleRate: number;
    codec: string;
}

interface AudioProcessOptions extends ProcessOptions {
    audio: {
        codec?: "aac" | "opus" | "mp3" | "flac" | "wav";
        bitrate?: number;
        channels?: 1 | 2;
        sampleRate?: 44100 | 48000;
        normalize?: boolean;
        trim?: {
            start: number;
            end: number;
        };
        fade?: {
            in?: number;
            out?: number;
        };
    };
}

export class AudioProcessor {
    private static instance: AudioProcessor;

    private constructor() {
        // Private constructor for singleton
        // Configure FFmpeg path if needed
        // ffmpeg.setFfmpegPath("/path/to/ffmpeg");
    }

    public static getInstance(): AudioProcessor {
        if (!AudioProcessor.instance) {
            AudioProcessor.instance = new AudioProcessor();
        }
        return AudioProcessor.instance;
    }

    public async processAudio(
        input: string,
        output: string,
        options: AudioProcessOptions,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            let command = ffmpeg(input);

            const { codec, bitrate, channels, sampleRate, normalize, trim, fade } =
                options.audio;

            // Apply codec and format settings
            if (codec) {
                switch (codec) {
                    case "aac":
                        command = command
                            .audioCodec("aac")
                            .audioBitrate(bitrate?.toString() ?? "128k")
                            .audioFrequency(sampleRate ?? 44100)
                            .audioChannels(channels ?? 2)
                            .format("m4a");
                        break;
                    case "opus":
                        command = command
                            .audioCodec("libopus")
                            .audioBitrate(bitrate?.toString() ?? "96k")
                            .audioFrequency(sampleRate ?? 48000)
                            .audioChannels(channels ?? 2)
                            .format("opus");
                        break;
                    case "mp3":
                        command = command
                            .audioCodec("libmp3lame")
                            .audioBitrate(bitrate?.toString() ?? "192k")
                            .audioFrequency(sampleRate ?? 44100)
                            .audioChannels(channels ?? 2)
                            .format("mp3");
                        break;
                    case "flac":
                        command = command
                            .audioCodec("flac")
                            .audioFrequency(sampleRate ?? 44100)
                            .audioChannels(channels ?? 2)
                            .format("flac");
                        break;
                    case "wav":
                        command = command
                            .audioCodec("pcm_s16le")
                            .audioFrequency(sampleRate ?? 44100)
                            .audioChannels(channels ?? 2)
                            .format("wav");
                        break;
                }
            }

            // Apply audio normalization
            if (normalize) {
                command = command.audioFilters("loudnorm").audioFilters("acompressor");
            }

            // Apply trim settings
            if (trim) {
                command = command
                    .setStartTime(trim.start)
                    .setDuration(trim.end - trim.start);
            }

            // Apply fade effects
            if (fade) {
                const filters: string[] = [];
                if (fade.in) {
                    filters.push(`afade=t=in:st=0:d=${fade.in}`);
                }
                if (fade.out) {
                    // We need to get the duration first
                    ffmpeg.ffprobe(input, (err, metadata) => {
                        if (err) return reject(err);
                        const duration = metadata.format.duration ?? 0;
                        filters.push(`afade=t=out:st=${duration - fade.out}:d=${fade.out}`);
                        command = command.audioFilters(filters);
                        this.saveCommand(command, output, resolve, reject);
                    });
                    return;
                }
                command = command.audioFilters(filters);
            }

            this.saveCommand(command, output, resolve, reject);
        });
    }

    private saveCommand(
        command: ffmpeg.FfmpegCommand,
        output: string,
        resolve: () => void,
        reject: (err: Error) => void,
    ) {
        command
            .on("end", () => resolve())
            .on("error", (err) => reject(err))
            .save(output);
    }

    public async extractMetadata(input: string): Promise<AudioMetadata> {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(input, (err, metadata) => {
                if (err) return reject(err);

                const audioStream = metadata.streams.find(
                    (s) => s.codec_type === "audio",
                );

                if (!audioStream) {
                    return reject(new Error("No audio stream found"));
                }

                resolve({
                    duration: metadata.format.duration ?? 0,
                    format: metadata.format.format_name ?? "",
                    bitrate: parseInt(metadata.format.bit_rate ?? "0", 10),
                    size: metadata.format.size ?? 0,
                    channels: audioStream.channels ?? 0,
                    sampleRate: audioStream.sample_rate
                        ? parseInt(audioStream.sample_rate, 10)
                        : 0,
                    codec: audioStream.codec_name ?? "",
                });
            });
        });
    }

    public async optimizeForWeb(
        input: string,
        output: string,
        quality: "low" | "medium" | "high" = "medium",
    ): Promise<void> {
        const options: AudioProcessOptions = {
            audio: {
                codec: "aac",
                channels: 2,
                sampleRate: 44100,
                normalize: true,
            },
        };

        // Adjust quality settings
        switch (quality) {
            case "low":
                options.audio.bitrate = 96; // 96 kbps
                break;
            case "medium":
                options.audio.bitrate = 128; // 128 kbps
                break;
            case "high":
                options.audio.bitrate = 192; // 192 kbps
                break;
        }

        return this.processAudio(input, output, options);
    }

    public async generateWaveform(
        input: string,
        output: string,
        width = 800,
        height = 200,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            ffmpeg(input)
                .complexFilter([
                    {
                        filter: "showwavespic",
                        options: {
                            s: `${width}x${height}`,
                            colors: "#3498db",
                        },
                    },
                ])
                .on("end", () => resolve())
                .on("error", (err) => reject(err))
                .save(output);
        });
    }

    public async splitToChunks(
        input: string,
        outputPattern: string,
        chunkDuration = 60,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            ffmpeg(input)
                .outputOptions([
                    `-f segment`,
                    `-segment_time ${chunkDuration}`,
                    "-c copy",
                ])
                .on("end", () => resolve())
                .on("error", (err) => reject(err))
                .save(`${outputPattern}_%03d.m4a`);
        });
    }
}
