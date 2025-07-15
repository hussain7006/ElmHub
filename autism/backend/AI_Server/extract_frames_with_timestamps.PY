import av
import os
from PIL import Image

def extract_frames_with_timestamps(video_path, save_frames=False, output_dir="frames"):
    container = av.open(video_path)
    video_stream = container.streams.video[0]

    if save_frames:
        os.makedirs(output_dir, exist_ok=True)

    print(f"Video Time Base: {video_stream.time_base}")
    print(f"Codec: {video_stream.codec_context.name}")
    print(f"Total Frames: {video_stream.frames}")

    for i, frame in enumerate(container.decode(video=0)):
        # Accurate timestamp from PTS
        pts = frame.pts
        time_base = video_stream.time_base
        timestamp = float(pts * time_base)

        print(f"Frame {i}: Timestamp = {timestamp:.6f} seconds")

        if save_frames:
            img = frame.to_image()  # Convert to PIL image
            img.save(os.path.join(output_dir, f"frame_{i:05d}_{timestamp:.3f}.jpg"))

if __name__ == "__main__":
    # Example usage
    video_file_path = "./uploads/user_1748471067676/recording.webm"  # Replace with your path
    extract_frames_with_timestamps(video_file_path, save_frames=True)
