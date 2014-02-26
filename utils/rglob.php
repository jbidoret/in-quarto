<?php
/**
 * Recursive glob
 * @param string $pattern Masque à vérifier
 * @param string $path Répertoire initial
 * @param integer $flags Drapeaux
 * @return array list of files
 */
function rglob($pattern='*', $path='', $flags = 0) {
   $paths=glob($path.'*', GLOB_MARK|GLOB_ONLYDIR|GLOB_NOSORT);
   $files=glob($path.$pattern, $flags);
   foreach ($paths as $path) {
      $files=array_merge($files,rglob($pattern, $path, $flags));
   }
   return $files;
}
?>