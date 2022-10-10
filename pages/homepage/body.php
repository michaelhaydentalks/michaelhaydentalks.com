<?php

$body = file_get_contents(__DIR__."/body.html");
$latestVideoHTML = isset($latestVideoHTML) && is_array($latestVideoHTML) && count($latestVideoHTML)>2 ? '<a href="video/'.$latestVideoHTML[1].'" class="latest-video-hero"><span class="newest-label pulse"><i class="fas fa-star"></i>&nbsp;new</span><img src="'.$latestVideoHTML[2].'"><h2>'.$latestVideoHTML[0].'</h2></a>':
'<figure><iframe id="introVideo" src="https://player.vimeo.com/video/479926569" width="640" height="360" frameborder="0"
  allow="fullscreen" allowfullscreen></iframe></figure>';
  
$body = str_replace(['$latest'], [$latestVideoHTML], $body);

$title = "Home";