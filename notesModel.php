<?php
class notesModel
{
	public $color = "red";
	public $contents = "";
	public $height = -1;
	public $id = -1;
	public $image_id = -1;
	public $image_source = null;
	public $layer = -1;
	public $position_x = -1;
	public $position_y = -1;
	public $width = -1;
	
	function __construct($data) {
        if (!empty($data))
		{
			$this->id = $data["ID"];
			$this->position_x = $data["POSITION_X"];
			$this->position_y = $data["POSITION_Y"];
			$this->color = $data["COLOR"];
			$this->width = $data["WIDTH"];
			$this->height = $data["HEIGHT"];
			$this->layer = $data["LAYER"];
			$this->image_id = $data["IMAGE_ID"];
			$this->image_source = $data["IMAGE"];
			$this->contents = $data["CONTENTS"];
		}	
    }
}
?>