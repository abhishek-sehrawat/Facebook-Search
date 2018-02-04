<?php
    require_once __DIR__ . '/src/Facebook/autoload.php';

    try{
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $keyword = $_GET['keyword'];
        $type = $_GET['type'];
        $searchType = $_GET['searchType'];

        $query = $albumData = $postData = "";
        //$fields = "id,name,picture.width(700).height(700)";
        $access_token = "";                                                             // add your ACCESS TOKEN here
        $api_key = "";                                                                  // add your API KEY here
        $data;

        $fb = new Facebook\Facebook([
            'app_id' => '',                                                             // add your APP ID here
            'app_secret' => '',                                                         // add your APP SECRET ID here
            'default_graph_version' => 'v2.8',
        ]);

        $fb->setDefaultAccessToken('');                                                 // add the $access_token variable here

        if($searchType == "basic"){
            $pagination = $_GET['pagination'];

            if($pagination == "false"){
                $fields = "id,name,picture.width(700).height(700)";
                if($type == "place"){
                    $latitude = $_GET['latitude'];
                    $longitude = $_GET['longitude'];
                    $query = "/search?q=".$keyword."&type=".$type."&fields=".$fields."&center=".$latitude.",".$longitude."&access_token=".$access_token;
                } else{
                    $query = "/search?q=".$keyword."&type=".$type."&fields=".$fields."&access_token=".$access_token;
                }
            } else {
                $query = "/search?".$pagination;
            }

            $query = str_replace(" ", '%20', $query);
            $response = $fb->get($query, $access_token);
            $response = $response->getDecodedBody();
            $responseData = $response['data'];
            $pagingData = $response['paging'];
            
            $arr = array('data' => $responseData, 'paging' => $pagingData, 'query' => $query);
            echo json_encode($arr);
        
        } else if($searchType == "detailed"){

            $detailId = $_GET['detailId'];

            $fields = "albums.limit(5){name,photos.limit(2){name,picture,images}},posts.limit(5){message,story,created_time}";
            $query = "/".$detailId."?fields=".$fields."&access_token=".$access_token;

            $query = str_replace(" ", '%20', $query);

            $response = $fb->get($query, $access_token);
            $response = $response->getDecodedBody();
            //$albums = $response['albums'];

            if(array_key_exists('albums', $response)){
                $albums = $response['albums'];
                $albumData = $albums['data'];
            }
            if(array_key_exists('posts', $response)){
                $posts = $response['posts'];
                $postData = $posts['data'];
            }

            $arr = array('albumData' => $albumData, 'postData' => $postData);
            //$arr = array('data' => $response);
            echo json_encode($arr);
            //echo json_encode($albumData);
        }

        
    } catch(Facebook\Exceptions\FacebookResponseException $e) {
        echo 'Graph returned an error: ' . $e->getMessage();
        exit;
    } catch(Facebook\Exceptions\FacebookSDKException $e) {
        echo 'Facebook SDK returned an error: ' . $e->getMessage();
        exit;
    }
    
?>