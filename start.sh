# /bin/bash
set -euo pipefail

echo "Select the environment to start:"
echo " 1) Launch development environment"
echo " 2) Build the development environment"
echo " 3) Exit"

read n
case $n in
	1) option=1;;
	2) option=2;;
	3) option=3;;
	*) 
		echo "Invalid Option"
		exit
		;;
esac


echo
case $option in
        1)
            docker run -v $(pwd):/opt/workspace -p 3000:3000 -it gomoku/deco7381-development:v1.0.1 /bin/bash
	    ;;
        2)
            docker build -t gomoku/deco7381-development:v1.0.1 -f ./docker/development.dockerfile .
	    docker push gomoku/deco7381-development:v1.0.1
	    ;;
esac

