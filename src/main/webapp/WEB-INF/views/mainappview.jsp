<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<title>Home</title>
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="css/bootstrap/bootstrap.min.css">
	<!-- AdminCSS -->
	<link rel="stylesheet" href="css/custom/sb-admin.css">
	<link rel="stylesheet" type="text/css" href="css/jquery/bookblock.css"/>

	<link rel="stylesheet" type="text/css" href="css/custom/bookblockcustom.css"/>
	<!-- CustomCSS -->
	<link rel="stylesheet" href="css/custom/custom.css">
		<!-- FONTS -->
	<link rel="stylesheet" href="css/custom/font-awesome.css">
		
</head>
<body  ng-app="cdaApp">
	
	<div id="wrapper" style="height:100%" ng-controller="ViewCDAController">
	<!-- Navigation Bar -->
	<nav class="navbar navbar-inverse navbar-fixed-top custom-navbar">
    		<div class="navbar-header">
    			<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        			<span class="icon-bar"></span>
        			<span class="icon-bar"></span>
        			<span class="icon-bar"></span> 
      			</button>
      			<a class="navbar-brand" href="#welcome" style="padding-top:7px">
        			<img alt="Brand" src="img/logo_small.png">
      			</a>
      		</div>
      		<!-- <div class="collapse navbar-collapse">-->
      			<ul class="nav top-nav">
	        			<li  class="active">
        					<a href="#viewCDA" ng-click="reload()"><span class="glyphicon glyphicon-book"></span> CDA Viewer</a>
        				</li>
        		</ul>
     		<!-- </div>-->
     		 <div ng-show="showIFrame">
                <ul class="nav navbar-nav side-nav collapse navbar-collapse"  id="myNavbar">
                    <li class="bb-nav-menu active" style="cursor: pointer;">
                        <a href="#">General Info</a>
                    </li>
                    <li class="bb-nav-menu" ng-repeat="item in testObject.items"><a href="#">{{item.title}}</a></li>
                </ul>
            </div>
	</nav>
	
	<!-- Main Panel -->
	<div id="page-wrapper" ng-view style="height:100%; overflow: auto">
    </div>
</div>

<!-- Scripts -->
	<!-- jQuery -->
  	<script src="js/jquery/jquery-1.10.1.js"></script>
  	<script src="js/jquery/jquerypp.custom.js"></script>
  	<script src="js/jquery/modernizr.custom.js"></script>
  	<script src="js/jquery/moment.js"></script>
  	<script src="js/jquery/jquery.bookblock.js"></script>
	<!-- BootStrap and other plugins-->
	<script type="text/javascript" src="js/bootstrap/bootstrap.js"></script>
	
	<!-- Angular -->
	<script type="text/javascript" src="js/angular/angular.js"></script>
	<script type="text/javascript" src="js/angular/angular-route.min.js"></script>
	<script type="text/javascript" src="js/bootstrap/ui-bootstrap.js"></script>
	<script type="text/javascript" src="js/angular/fileupload/angular-file-upload.min.js"></script>
	
	<!-- Application -->
	<script type="text/javascript" src="js/angular/application/mainApp.js"></script>
	<script type="text/javascript" src="js/angular/application/ViewCDAController.js"></script>
	
	<!-- Directives -->
	<script type="text/javascript" src="js/angular/application/BookBlockDirective.js"></script>
	
</body>
</html>
