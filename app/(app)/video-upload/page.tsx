import React ,{useState}  from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast';
import { NextResponse } from 'next/server';


function VideoUpload() {

  const [file,setFile] = useState<File|null>(null);
  const[title,setTitle] = useState("");
  const[description,setDescrption] = useState("");
  const [isUploading, setIsUploading] = useState(false)

  const router = useRouter();

  // maxFile size =70
  const MAX_FILE_SIZE = 70*1024*1024;

  const handleSubmit =async(event:React.FormEvent)=>{
    event.preventDefault();
    if(!file){
      return;
    }
    if(file.size> MAX_FILE_SIZE ){
      toast.error("file size is too large");
      alert("file size too large");
      return;
    }

    // collect all the data
    const formData = new FormData();
    formData.append("file",file);
    formData.append("title",title);
    formData.append("description",description);
    formData.append("orginalSize",file.size.toString());

    try {
      const response = await axios.post("/api/video-upload",formData);
      // check for 200 for reponse ;
      if(response.status==200){
        toast.success("videos uploaded successfully");
        return NextResponse.json({message:"Video uploaded"},{status:200})
      }else{
        toast.error("Unable to upload the video");
        return NextResponse.json({message:"Unaable to upload the video"},{
          status:400
        })
      }
    } catch (error) {
      console.log(error);
    }
    finally{
      setIsUploading(false)
    }
  }

  return (
    <div className='container mx-auto px-4'>
      <h1 className='text-2xl font-bold mb-4'>Upload Video</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='label'>
            <span className='label-text'>Title</span>
          </label>
          <input
           type="text"
           value={title}
           onChange={(e)=>setTitle(e.target.value)} 
           className='input input-bordered w-full'
           required
           />
        </div>
        <div>
          <label className='label'>
            <span className='label-text'>Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e)=>setDescrption(e.target.value)}
            className='text textarea-bordered w-full'
          />
        </div>
        <div>
          <label className='label'>
            <span className='label-text'>Video File</span>
          </label>
          <input 
            type="text"
            accept='video/*'
             onChange={(e)=>setFile(e.target.files?.[0]||null)}
             className='file-input file-input-bordered w-full'
             required
          />
        </div>
        <button
        type='submit'
        className='btn btn-primary'
        disabled={isUploading}
        >
          {isUploading?"Uploading....":"Upload Video "}
        </button>
      </form>
    </div>
  )
}

export default VideoUpload