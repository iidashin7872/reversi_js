for i in range(8):
    print("<div class=\"board-row\">")
    for j in range(8):
        print("\t<button type=\"button\" class=\"btn btn-outline-dark square\" data-row=\"{}\" data-col=\"{}\"></button>".format(i,j))
    print("</div>")