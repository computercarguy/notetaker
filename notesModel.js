class notesModel 
{
	constructor(data)
	{
		this.new_image_source = null;
		
		if (data)
		{
			this.color = data.color;
			this.contents = data.contents;
			this.height = data.height;
			this.id = data.id;
			this.image_id = data.image_id;
			this.image_source = data.image_source;
			this.layer = data.layer;
			this.position_x = data.position_x;
			this.position_y = data.position_y;
			this.width = data.width;
		}
		else
		{
			this.color = "red";
			this.contents = "";
			this.height = -1;
			this.id = -1;
			this.image_id = -1;
			this.image_source = null;
			this.layer = -1;
			this.position_x = -1;
			this.position_y = -1;
			this.width = -1;
		}
	}
	
	setImage(imageSource)
	{
		this.image_source = imageSource;
	}

	setNewImage(imageSource)
	{
		this.new_image_source = imageSource;
	}
	
	setImageId(id)
	{
		this.image_id = id;
	}
	
	deleteImage()
	{
		this.image_source = null;
		this.image_id = -1;
	}

	clearNewImage()
	{
		this.new_image_source = null;
	}
}
