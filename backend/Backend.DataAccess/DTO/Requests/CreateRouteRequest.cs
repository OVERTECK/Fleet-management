namespace Backend.DataAccess.DTO.Requests;

public class CreateRouteRequest
{
    public required DateTime Start { get; set; }

    public required DateTime End { get; set; }

    public required int CountKM { get; set; }
}