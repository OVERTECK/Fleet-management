namespace Backend.DataAccess.DTO.Requests.Driver;

public class CreateDriverRequest
{
    public string Name { get; init; }

    public string LastName { get; init; }

    public string Pathronymic { get; init; }

    public string ContactData { get; init; }

    public string CategoryDrive { get; init; }
}