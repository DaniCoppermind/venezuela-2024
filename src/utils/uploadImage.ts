import { imgToWebp } from '@/utils/imgToWebp.ts';
import { uuidv4 } from '@/utils/uuidv4.ts';
import { supabase } from '@/lib/supabase.ts';

type UploadedImage = {
  path: string;
  publicUrl: string;
};

export async function uploadImage(imageFile: Blob, bucket: string): Promise<UploadedImage> {
  const webpImg = await imgToWebp(imageFile, 200, 200);
  const path = `public/${uuidv4()}.webp`;
  const { data, error } = await supabase.storage.from(bucket).upload(path, webpImg, {
    contentType: 'image/webp',
  });

  if (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data?.path);

  return {
    path,
    publicUrl,
  };
}
