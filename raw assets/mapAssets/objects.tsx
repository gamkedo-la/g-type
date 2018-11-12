<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.2" tiledversion="1.2.0" name="objects" tilewidth="300" tileheight="200" tilecount="35" columns="0">
 <grid orientation="orthogonal" width="1" height="1"/>
 <tile id="0" type="rock01">
  <properties>
   <property name="Group" type="int" value="0"/>
  </properties>
  <image width="74" height="73" source="objectSprites/Rock01.png"/>
 </tile>
 <tile id="2" type="rock02">
  <properties>
   <property name="Group" type="int" value="0"/>
  </properties>
  <image width="40" height="40" source="objectSprites/Rock02.png"/>
 </tile>
 <tile id="3" type="rock03">
  <properties>
   <property name="Group" type="int" value="0"/>
  </properties>
  <image width="32" height="37" source="objectSprites/Rock03.png"/>
 </tile>
 <tile id="4" type="rock04">
  <properties>
   <property name="Group" type="int" value="0"/>
  </properties>
  <image width="27" height="27" source="objectSprites/Rock04.png"/>
 </tile>
 <tile id="6" type="rhombusBoulder">
  <properties>
   <property name="Group" type="int" value="0"/>
  </properties>
  <image width="90" height="90" source="objectSprites/_editorBoulder.png"/>
 </tile>
 <tile id="8" type="flyingEnemy1">
  <properties>
   <property name="Group" type="int" value="0"/>
   <property name="Speed" type="int" value="-100"/>
   <property name="difficulty" type="int" value="1"/>
   <property name="pattern" value="none"/>
  </properties>
  <image width="30" height="21" source="objectSprites/_editorFlyingEnemy1.png"/>
 </tile>
 <tile id="9" type="flyingEnemy2">
  <properties>
   <property name="Group" type="int" value="0"/>
   <property name="Speed" type="int" value="-150"/>
   <property name="difficulty" type="int" value="1"/>
   <property name="pattern" value="none"/>
  </properties>
  <image width="50" height="50" source="objectSprites/_editorFlyingEnemy2.png"/>
 </tile>
 <tile id="11" type="flyingEnemy1">
  <properties>
   <property name="Group" type="int" value="0"/>
   <property name="Speed" type="int" value="-100"/>
   <property name="difficulty" type="int" value="1"/>
   <property name="pattern" value="sine"/>
  </properties>
  <image width="30" height="21" source="objectSprites/_editorFlyingEnemy1Sine.png"/>
 </tile>
 <tile id="14" type="capsule1">
  <properties>
   <property name="Group" type="int" value="0"/>
  </properties>
  <image width="33" height="27" source="objectSprites/_editorPowerUp.png"/>
 </tile>
 <tile id="15" type="bubble">
  <properties>
   <property name="Group" type="int" value="0"/>
  </properties>
  <image width="30" height="30" source="objectSprites/_editorBubble.png"/>
 </tile>
 <tile id="17" type="groundEnemy1">
  <properties>
   <property name="Group" type="int" value="0"/>
   <property name="difficulty" type="int" value="1"/>
   <property name="rotation" type="float" value="4.7123889800000001"/>
  </properties>
  <image width="30" height="30" source="objectSprites/_editorGroundEnemy1E.png"/>
 </tile>
 <tile id="18" type="groundEnemy1">
  <properties>
   <property name="Group" type="int" value="0"/>
   <property name="difficulty" type="int" value="1"/>
   <property name="rotation" type="float" value="5.497787143"/>
  </properties>
  <image width="30" height="30" source="objectSprites/_editorGroundEnemy1NE.png"/>
 </tile>
 <tile id="19" type="groundEnemy1">
  <properties>
   <property name="Group" type="int" value="0"/>
   <property name="difficulty" type="int" value="1"/>
   <property name="rotation" type="float" value="0.78539816299999998"/>
  </properties>
  <image width="30" height="30" source="objectSprites/_editorGroundEnemy1NW.png"/>
 </tile>
 <tile id="20" type="groundEnemy1">
  <properties>
   <property name="Group" type="int" value="0"/>
   <property name="difficulty" type="int" value="1"/>
   <property name="rotation" type="float" value="3.141592653"/>
  </properties>
  <image width="30" height="30" source="objectSprites/_editorGroundEnemy1S.png"/>
 </tile>
 <tile id="21" type="groundEnemy1">
  <properties>
   <property name="Group" type="int" value="0"/>
   <property name="difficulty" type="int" value="1"/>
   <property name="rotation" type="float" value="3.926990816"/>
  </properties>
  <image width="30" height="30" source="objectSprites/_editorGroundEnemy1SE.png"/>
 </tile>
 <tile id="22" type="groundEnemy1">
  <properties>
   <property name="Group" type="int" value="0"/>
   <property name="difficulty" type="int" value="1"/>
   <property name="rotation" type="float" value="2.35619449"/>
  </properties>
  <image width="30" height="30" source="objectSprites/_editorGroundEnemy1SW.png"/>
 </tile>
 <tile id="23" type="groundEnemy1">
  <properties>
   <property name="Group" type="int" value="0"/>
   <property name="difficulty" type="int" value="1"/>
   <property name="rotation" type="float" value="1.570796326"/>
  </properties>
  <image width="30" height="30" source="objectSprites/_editorGroundEnemy1W.png"/>
 </tile>
 <tile id="24" type="groundEnemy1">
  <properties>
   <property name="Group" type="int" value="0"/>
   <property name="difficulty" type="int" value="1"/>
   <property name="rotation" type="float" value="0"/>
  </properties>
  <image width="30" height="30" source="objectSprites/_editorGroundEnemy1.png"/>
 </tile>
 <tile id="25" type="flyingEnemy2">
  <properties>
   <property name="Group" type="int" value="0"/>
   <property name="Speed" type="int" value="-150"/>
   <property name="difficulty" type="int" value="1"/>
   <property name="pattern" value="points"/>
  </properties>
  <image width="50" height="50" source="objectSprites/_editorFlyingEnemy2Path.png"/>
 </tile>
 <tile id="26" type="cargoBoss">
  <properties>
   <property name="Group" type="int" value="0"/>
  </properties>
  <image width="300" height="200" source="objectSprites/_editorCargoBoss.png"/>
 </tile>
 <tile id="27">
  <image width="12" height="12" source="objectSprites/tiny_asteroid.png"/>
 </tile>
 <tile id="28" type="girderHorizontal">
  <image width="179" height="19" source="objectSprites/girder_horizontal.png"/>
 </tile>
 <tile id="29" type="girderVertical">
  <image width="19" height="133" source="objectSprites/girder_vertical.png"/>
 </tile>
 <tile id="30" type="ragnarokCapsule">
  <properties>
   <property name="Group" type="int" value="0"/>
  </properties>
  <image width="60" height="60" source="objectSprites/_editorRagnarok.png"/>
 </tile>
 <tile id="31" type="miniBoss1">
  <properties>
   <property name="Group" type="int" value="0"/>
   <property name="difficulty" type="int" value="50"/>
   <property name="pattern" value="loop"/>
   <property name="speed" type="int" value="-200"/>
  </properties>
  <image width="60" height="34" source="objectSprites/MiniBoss1.png"/>
 </tile>
 <tile id="33" type="flyingEnemy3">
  <properties>
   <property name="Group" type="int" value="0"/>
   <property name="difficulty" type="int" value="10"/>
   <property name="pattern" value="none"/>
   <property name="speed" type="int" value="-150"/>
  </properties>
  <image width="45" height="45" source="objectSprites/_editorFlyingEnemy3.png"/>
 </tile>
 <tile id="34" type="flyingEnemy3">
  <properties>
   <property name="Group" type="int" value="0"/>
   <property name="difficulty" type="int" value="10"/>
   <property name="pattern" value="points"/>
   <property name="speed" type="int" value="-150"/>
  </properties>
  <image width="45" height="45" source="objectSprites/_editorFlyingEnemy3Path.png"/>
 </tile>
 <tile id="36" type="platform1">
  <properties>
   <property name="Group" type="int" value="0"/>
  </properties>
  <image width="76" height="38" source="objectSprites/_editorPlatform1.png"/>
 </tile>
 <tile id="37" type="groundEnemy2">
  <properties>
   <property name="Group" type="int" value="0"/>
   <property name="Speed" type="int" value="-150"/>
   <property name="difficulty" type="int" value="1"/>
   <property name="pattern" value="loop"/>
  </properties>
  <image width="40" height="28" source="objectSprites/_editorGroundEnemy2.png"/>
 </tile>
 <tile id="38" type="groundEnemy3">
  <properties>
   <property name="Group" type="int" value="0"/>
   <property name="difficulty" type="int" value="20"/>
  </properties>
  <image width="120" height="126" source="objectSprites/_editorTurret.png"/>
 </tile>
 <tile id="39" type="launchBay">
  <properties>
   <property name="Group" type="int" value="0"/>
  </properties>
  <image width="150" height="90" source="objectSprites/_editorSpawnPoint.png"/>
 </tile>
 <tile id="40" type="brokenBoulder">
  <properties>
   <property name="Group" type="int" value="0"/>
  </properties>
  <image width="77" height="68" source="objectSprites/BrokenBoulder.png"/>
 </tile>
 <tile id="41" type="brokenBoulderFlipped">
  <properties>
   <property name="Group" type="int" value="0"/>
  </properties>
  <image width="77" height="68" source="objectSprites/BrokenBoulderFlipped.png"/>
 </tile>
 <tile id="42" type="warpObstacle">
  <properties>
   <property name="Group" type="int" value="0"/>
  </properties>
  <image width="107" height="74" source="objectSprites/_editorWarpObstacle.png"/>
 </tile>
 <tile id="43" type="bigDestRock">
  <properties>
   <property name="Group" type="int" value="0"/>
   <property name="childrenCount" type="int" value="100"/>
   <property name="timeDelay" type="int" value="256"/>
  </properties>
  <image width="40" height="40" source="objectSprites/_editorDestructableBoulder_Big.png"/>
 </tile>
</tileset>
